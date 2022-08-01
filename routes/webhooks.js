var router = require("express").Router();
const crypto = require("crypto");

const Tickets = require("../model/tickets");
const Reports = require("../model/reports");

const pdf = require("../pdf")
const mail = require("../mail")
const seatsio = require("seatsio");
const getRawBody = require("raw-body");

router.post("/test-tyvent", async (req, res) => {
  /* ---------- Custom Vars ---------- */
  const event = "test-tyvent"
  const secretKey = process.env.CLIENT_TESTTYVENT_SHOPIFYTOKEN;
  const menuid = 6793622421573;
  const variant_meat = 40225790820421;
  const variant_fish = 40225790853189;
  const variant_veggy = 40225790885957;
  const ticketid = 6793446785093;
  const variant_adult = 40221816619077;
  const variant_youth = 40221816651845;

  /* ---------- End Custom Vars ----------*/
  console.log("🎉 We got an order!");

  const hmac = req.get("X-Shopify-Hmac-Sha256");
  const body = await getRawBody(req);

  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(body, "utf8", "hex")
    .digest("base64");

  if (hash === hmac) {
    const order = JSON.parse(body.toString());

    /* ---------- Menu Section ---------- */
    var amount_meat = 0;
    var amount_fish = 0;
    var amount_veggy = 0;

    order.line_items.forEach((element) => {
      if (element.product_id === menuid) {
        // Es ist überprüft worden ob es überhaupt ein Ticket ist
        switch (element.variant_id) {
          case variant_meat:
            amount_meat = element.quantity;
            break;
          case variant_fish:
            amount_fish = element.quantity;
            break;
          case variant_veggy:
            amount_veggy = element.quantity;
            break;
        }
      }
    });

    // Reports.findOne({ type: "Menu-Meat" })
    //   .exec()
    //   .then(function (report) {
    //     await Reports.create({ type: "Menu-Meat", value: report.value + amount_meat });
    //   });


    /* ---------- End Menu Section ---------- */

    /* ---------- Seats.io ---------- */
    if (order.note) {
      let seatsArray = [];
      let orderNote = order.note;
      const noWhitespace = orderNote.replace(/\s/g, "");
      seatsArray = noWhitespace.split(",");
      let holdToken = seatsArray.pop();
      let orderObject = [];
      seatsArray.forEach((seat) => {
        if (amount_meat > 0) {
          orderObject.push({ objectId: seat, extraData: { order_id: order.id, name: order.customer.last_name + " " + order.customer.first_name, menu: "FLEISCH" } });
          amount_meat--;
        } else if (amount_fish > 0) {
          orderObject.push({ objectId: seat, extraData: { order_id: order.id, name: order.customer.last_name + " " + order.customer.first_name, menu: "FISCH" } });
          amount_fish--;
        } else if (amount_veggy > 0) {
          orderObject.push({ objectId: seat, extraData: { order_id: order.id, name: order.customer.last_name + " " + order.customer.first_name, menu: "VEGGY" } });
          amount_veggy--;
        } else {
          orderObject.push({ objectId: seat, extraData: { order_id: order.id, name: order.customer.last_name + " " + order.customer.first_name } });
        }
      });
      let client = new seatsio.SeatsioClient(
        seatsio.Region.EU(),
        process.env.SEATSIOKEY
      );
      try {
        await client.events.book(event, orderObject, holdToken);
      } catch (error) {

      }
    }
    /* ---------- End Seats.io ---------- */

    /* ---------- Qr Tickets ---------- */
    var amount_adult = 0;
    var array_adult = [];
    var amount_youth = 0;
    var array_youth = [];

    /* ----- 1) Ermittlung wie viele Tickets gekauft wurden ----- */
    order.line_items.forEach((element) => {
      if (element.product_id === ticketid) {
        // Es ist überprüft worden ob es überhaupt ein Ticket ist
        switch (element.variant_id) {
          case variant_adult:
            amount_adult = element.quantity;
            break;
          case variant_youth:
            amount_youth = element.quantity;
            break;
        }
      }
    });

    /* ----- 2) Erstellen von Arrays mit uid etc. ----- */
    for (let index = 0; index < amount_adult; index++) {
      array_adult.push({
        uuid: crypto.randomUUID(),
        status: "BOUGHT",
        type: "ADULT",
        customer: order.customer.id,
        issuer: "APIWEBHOOK",
        event: event,
      });
    }
    for (let index = 0; index < amount_youth; index++) {
      array_youth.push({
        uuid: crypto.randomUUID(),
        status: "BOUGHT",
        type: "YOUTH",
        customer: order.customer.id,
        issuer: "APIWEBHOOK",
        event: event,
      });
    }

    /* ----- 3) Qr-Code Tickets erstellen und im Buffer speichern ----- */
    var attachments = []
    array_adult.forEach(async (element) => { const pdf_ticket = await pdf.createPdfInBuffer(); attachments.push({ filename: event + 'Ticket-Erwachsen - ' + element.uuid + '.pdf', content: pdf_ticket }) })
    array_youth.forEach(async (element) => { const pdf_ticket = await pdf.createPdfInBuffer(); attachments.push({ filename: event + 'Ticket-Jugend - ' + element.uuid + '.pdf', content: pdf_ticket }) })

    /* ----- 4) Qr-Codes per AWS SES versenden ----- */
    mail.sendTicketsQr(order.email, event, attachments)
    /* ----- 5) Tickets mit auf Qr-Code gespeicherten uids in die Datenbank speichern ----- */
    // array_adult.forEach(element => {
    //   await Tickets.create(element);
    // });
    // array_youth.forEach(element => {
    //   await Tickets.create(element);
    // });

    console.log("Jugend" + amount_youth);
    console.log("Erwachsen" + amount_adult);

    /* ---------- End Qr Tickets ---------- */



    res.sendStatus(200);
  } else {
    // No match! This request didn't originate from Shopify
    console.log("Danger! Not from Shopify!");
    res.sendStatus(403);
  }
});

module.exports = router;

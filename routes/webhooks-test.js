var router = require("express").Router();
const crypto = require("crypto");
const mycrypto = require("../mycrypto")
var bodyParser = require('body-parser');


const Tickets = require("../model/tickets");
const Events = require("../model/events");

const Reports = require("../model/reports");

const pdf = require("../pdf")
const mail = require("../mail")
const seatsio = require("seatsio");
const getRawBody = require("raw-body");


Events.find()
  .exec()
  .then(function (events) {
    events.forEach(element => {
      router.post(`${element.event}`, async (req, res) => {
        res.sendStatus(200);
        /* ---------- Custom Vars ---------- */
        const event = element.event
        const secretKey = mycrypto.decrypt(element.key);
        const menuid = element.menus.shopifyid;
        const variant_meat = 40225790820421;
        const variant_fish = 40225790853189;
        const variant_veggy = 40225790885957;
        const ticketid = element.tickets.shopifyid;
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
          if (element.menus.length > 0) {
            element.menus.variants.forEach((variants) => {
              order.line_items.forEach((element) => {
                if (element.product_id === menuid) {
                  // Es ist überprüft worden ob es überhaupt ein Ticket ist
                  if (element.variant_id == variants.id) {
                    Reports.findOne({ type: variants.type, event: event })
                      .exec()
                      .then(async function (report) {
                        await Reports.updateOne({ type: variants.type, event: event }, {
                          value: Number(report.value) + Number(element.quantity)
                        });
                      });
                  }
                }
              });
            })
          }
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
              console.log("ihabanerror") //TODO: Error handeln
              console.log(error)

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
          if (amount_adult > 0 || amount_youth > 0) {
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
            await new Promise((resolve, reject) => {
              if (array_adult.length > 0)
                array_adult.forEach(async (element, index) => {
                  const pdf_ticket = await pdf.createPdfInBuffer(event, "Erwachsen", element.uuid, order.payment_gateway_names[0]);
                  attachments.push({ filename: event + 'Ticket-Erwachsen - ' + element.uuid + '.pdf', content: pdf_ticket });
                  console.log("erstellt-erwachsen");
                  console.log(index + " " + array_adult.length)
                  if (index === array_adult.length - 1) resolve();
                })
              else
                resolve()
            });
            await new Promise((resolve, reject) => {
              if (array_youth.length > 0)
                array_youth.forEach(async (element, index) => {
                  const pdf_ticket = await pdf.createPdfInBuffer(event, "Jugend", element.uuid, order.payment_gateway_names[0]);
                  attachments.push({ filename: event + 'Ticket-Jugend - ' + element.uuid + '.pdf', content: pdf_ticket });
                  console.log("erstellt-jugend");
                  if (index === array_youth.length - 1) resolve();
                })
              else
                resolve()
            });

            console.log(attachments)
            /* ----- 4) Qr-Codes per AWS SES versenden ----- */
            console.log(await mail.sendTicketsQr(order.email, event, attachments, order.customer.first_name, order.customer.last_name))
            /* ----- 5) Tickets mit auf Qr-Code gespeicherten uids in die Datenbank speichern ----- */
            array_adult.forEach(async (element) => {
              await Tickets.create(element);
            });
            array_youth.forEach(async (element) => {
              await Tickets.create(element);
            });

            console.log("Jugend" + amount_youth);
            console.log("Erwachsen" + amount_adult);
          }

          /* ---------- End Qr Tickets ---------- */


          console.log("🎉 We fulfilled an order!");

        } else {
          // No match! This request didn't originate from Shopify
          console.log("Danger! Not from Shopify!");
          res.sendStatus(403);
        }
      });
    });
  });



module.exports = router;

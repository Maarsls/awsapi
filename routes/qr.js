var router = require("express").Router();
const QRCode = require("qrcode");
const Stream = require("stream");

router.get("/redirect/:uuid", async (req, res) => {
  res.redirect("https://google.at"); //TODO: change to our domain
});

router.get("/:ticketuid", async (req, res) => {
  const content =
    "http://ec2-3-66-167-52.eu-central-1.compute.amazonaws.com/qr/redirect/" +
    req.params.ticketuid;
  const qrStream = new Stream.PassThrough();
  const result = await QRCode.toFileStream(qrStream, content, {
    errorCorrectionLevel: "H",
    type: "terminal",
    quality: 0.95,
    margin: 1,
    color: {
      dark: "#208698",
      light: "#FFF",
    },
    width: 300,
    height: 300,
  });

  qrStream.pipe(res);
});

module.exports = router;

var router = require("express").Router();

router.get("/.well-known/acme-challenge/gxE_yFkq30fc267MVVD_Q3NaMt-Xl2xnR9ZL-oGbncM", (req, res) => {
  res.send("gxE_yFkq30fc267MVVD_Q3NaMt-Xl2xnR9ZL-oGbncM.aUDOln_wJChD2cyuiTPYy6Ds9ZSRPh81Pi0ZrxeUalw");
});

router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;

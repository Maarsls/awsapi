var router = require("express").Router();

router.get("/.well-known/acme-challenge/YgEqLRNogFKOXhEDTSL_G7t-OFGBFsHmW99j0jys3yY", (req, res) => {
  res.send("YgEqLRNogFKOXhEDTSL_G7t-OFGBFsHmW99j0jys3yY.aUDOln_wJChD2cyuiTPYy6Ds9ZSRPh81Pi0ZrxeUalw");
});

router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;

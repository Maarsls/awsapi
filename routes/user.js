var router = require("express").Router();
const User = require("../model/user");
const jwt = require("jsonwebtoken");
// const token = jwt.sign(
//         { user_id: user._id, email },
//         process.env.TOKEN_KEY,
//         {
//           expiresIn: "2h",
//         }
//       );

//       // save user token
//       user.token = token;

//       // user
//       res.status(200).json(user);
router.get("/:nuuid", (req, res) => {
  User.findOne({ nuuid: req.params.nuuid })
    .exec()
    .then(function (user) {
      if (user) {
        const token = jwt.sign(
          { user_id: user.nuuid, user_role: user.role },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        user.token = token;
        const send = { user: user, token: token };
        res.send(send);
        console.log(send);
      } else res.send({ success: false });
    });
});

router.post("/", async (req, res) => {
  const userRes = await User.create(req.body.user);

  res.send(userRes);
});

router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;

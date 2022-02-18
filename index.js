const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const auth = require("./middleware/auth");

const Partner = require("./model/partner");
const Entries = require("./model/entries");

app.get("/partner", (req, res) => {
  Partner.find()
    .exec()
    .then(function (users) {
      console.log(users);
      res.send(users);
    });
});

app.get("/entries", auth, (req, res) => {
  Entries.find()
    .exec()
    .then(function (users) {
      console.log(users);
      res.send(users);
    });
});

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

// server listening
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

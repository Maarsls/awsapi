const jwt = require("jsonwebtoken");

const token = jwt.sign(process.env.TOKEN_KEY, {
  expiresIn: "2h",
});

console.log(token);

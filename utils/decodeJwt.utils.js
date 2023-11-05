const privateKey = process.env.SECRET;
const jwt = require("jsonwebtoken");

const DeCodeJwt = (token) => {
  return jwt.verify(token, privateKey);
};

const CodeJwt = (data) => {
  return jwt.sign(data, privateKey);
};

module.exports = {
  DeCodeJwt,
  CodeJwt,
};

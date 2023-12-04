const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");

const privateKey = process.env.SECRET;
const Authentication = (req, res, next) => {
  try {
    const { token } = req.headers;
    //   console.log("token:   ", token);

    if (!token) {
      res.status(400).json({
        status: false,
        data: "vui long Login !! ",
      });
      return;
    }

    const decode = jwt.verify(token, privateKey, {
      expiresIn: "48h",
    });
    //   console.log(decode);
    if (decode.data.Role === "Admin" || decode.data.Role === "User") {
      next();
    } else {
      res.status(400).json({
        status: false,
        data: "Bạn không được phân quyền !! ",
      });
    }

    //   next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      data: error,
    });
  }
};

module.exports = Authentication;

const express = require("express");
const passport = require("passport");
const authenGoogle = express.Router();

const handleCallback = require("../controller/authGoogle.controller");
const {
  loginAuthen,
  handleCallbackMiddleware,
  logoutAuthen,
  profile,
} = require("../middleware/authenGoogle.middleware");

// const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// console.log(clientID);
// console.log(clientSecret);
passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      // sau khi đăng nhập thành công thì sẽ rẽ thướng
      callbackURL: "/auth/google/callback",
      //   callbackURL: "/home",
    },
    (accessToken, refreshToken, profile, done) => {
      // Xác thực thành công, thực hiện lưu thông tin người dùng vào CSDL hoặc phiên làm việc.
      // profile chứa thông tin người dùng từ Google.

      return done(null, profile);
    }
  )
);

authenGoogle.get("/data", (req, res) => {
  // console.log(dataProfile);
  res.json(dataProfile);
});

// Tuyến đường đăng nhập bằng Google
//localhost:3000/auth/google
authenGoogle.get("/google", loginAuthen());

// Tuyến đường xử lý callback sau khi xác thực thành công
//localhost:3000/auth/google/callback

authenGoogle.get(
  "/google/callback",
  handleCallbackMiddleware(),
  handleCallback
);

// Tuyến đường đăng xuất
authenGoogle.get("/logout", logoutAuthen);

module.exports = authenGoogle;

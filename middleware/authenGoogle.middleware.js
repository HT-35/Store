const passport = require("passport"); // Import passport if you're using a Node.js module system
// const authenGoogle = require("./authenGoogle"); // Import authenGoogle from a relevant module

let dataProfile = null;

// const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

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
      dataProfile = profile;
      return done(null, profile);
    }
  )
);

const loginAuthen = (req, res, next) => {
  return passport.authenticate("google", { scope: ["profile", "email"] });
};

const handleCallbackMiddleware = (req, res) => {
  return passport.authenticate("google", {
    session: false,
  });
};

const logoutAuthen = (req, res) => {
  req.logout();
  res.redirect("/");
  return;
};

const profile = (req, res, next) => {
  console.log(dataProfile);
  res.json(passport);
  return;
};

module.exports = {
  loginAuthen,
  handleCallbackMiddleware,
  logoutAuthen,
  profile,
};

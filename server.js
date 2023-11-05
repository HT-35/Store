const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const port = Number(process.env.PORT);
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const session = require("express-session");
const passport = require("passport");

// Bật tính năng sử dụng cookie và gửi cookie trong chính sách CORS
const corsOptions = {
  origin: "http://127.0.0.1:5500", // Thay thế bằng nguồn gốc của trang web của bạn
  credentials: true,
};

app.use(cors(corsOptions));

const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Sử dụng express-session
app.use(
  session({ secret: CLIENT_SECRET, resave: false, saveUninitialized: true })
);

// Sử dụng Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); // Middleware để xử lý JSON data
app.use(express.urlencoded({ extended: true })); // Middleware để xử lý urlencoded data

const db = require("./configs/connectDb");

db();
const root = require("./router/index.router");

app.use("/", root);

app.listen(port, () => {
  console.log(`poject run at http://localhost:${port}`);
});

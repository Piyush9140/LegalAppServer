const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoUrl =
  "mongodb+srv://piyushagarwal582:Piyush4107@cluster1.a9s6cny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });
require("./UserDetails");
const User = mongoose.model("UserInfo");
require("./LawyerDetails");
const Lawyer = mongoose.model("LawyerInfo");

app.post("/register-user", async (req, res) => {
  const { name, email, Password, Location, Number } = req.body;
  console.log(req.body);

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    return res.send({ status: "UserExists", data: "User already exists!!" });
  }
  const encryptedPassword = await bcrypt.hash(Password, 10);
  try {
    await User.create({
      name: name,
      email: email,
      password: encryptedPassword,
      location: Location,
      Number: Number,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});
app.post("/register-Lawyer", async (req, res) => {
  const { name, email, Password, Location, Number, LawyerCat, LawyerID } =
    req.body;
  console.log(req.body);

  const oldUser = await Lawyer.findOne({ email: email });

  if (oldUser) {
    return res.send({ status: "UserExists", data: "User already exists!!" });
  }
  const encryptedPassword = await bcrypt.hash(Password, 10);
  try {
    await Lawyer.create({
      name: name,
      email: email,
      password: encryptedPassword,
      location: Location,
      Number: Number,
      LawyerCat: LawyerCat,
      LawyerID:LawyerID
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.send({ status: "null", data: "User doesn't exists!!" });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    console.log(token);
    if (res.status(201)) {
      return res.send({
        status: "ok",
        data: token,
      });
    } else {
      return res.send({ error: "error" });
    }
  }
});
app.post("/login-Lawyer", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const oldUser = await Lawyer.findOne({ email: email });

  if (!oldUser) {
    return res.send({ status: "null", data: "User doesn't exists!!" });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    console.log(token);
    if (res.status(201)) {
      return res.send({
        status: "ok",
        data: token,
      });
    } else {
      return res.send({ error: "error" });
    }
  }
});

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.listen(5001, () => {
  console.log("Node js is connected");
});

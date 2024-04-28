const express = require("express");
const app = express();
const { dockStart } = require("@nlpjs/basic");
app.use(express.json());
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
(async () => {
  const dock = await dockStart({ use: ["Basic"] });
  const nlp = dock.get("nlp");
  await nlp.addCorpus("./corpus-en.json");
  await nlp.train();
  app.post("/bot", async (req, res) => {
    const { message } = req.body;
    let response = await nlp.process("en", req.body.message);
    res.send({ data: response.answer });
    console.log(req.body.message);
    console.log(response.answer);
  });
})();
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
const Message = require("./message");
const fetchUser = require("./Middle/fetchUser");
app.post("/register-user", async (req, res) => {
  const { name, email, Password, Location, Number } = req.body;
  console.log(req.body);

  const oldUser = await User.findOne({ email: email });

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(Number)) {
    return res.send({ status: "Wrong Number", data: "Enter New User Detail" });
  }

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
      LawyerID: LawyerID,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});
const createToken = (userId) => {
  const payload = {
    userId: userId,
  };
  //  console.log(userId)
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });
  return token;
};
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.send({ status: "null", data: "User doesn't exists!!" });
  }
  if (!(await bcrypt.compare(password, oldUser.password))) {
    return res.send({ status: "Wrongpass", data: "doesn't exists!!" });
  }
  if (await bcrypt.compare(password, oldUser.password)) {
    // const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    // console.log(token);
    const token = createToken(oldUser._id);
    const token1 = oldUser._id;

    // console.log(oldUser._id)
    //  res.status(200).json({ token });
    if (res.status(201)) {
      return res.send({
        status: "ok",
        token: {
          token,
          token1,
        },
      });
    } else {
      return res.send({ error: "error" });
    }
  }
});
// app.post("/fetchUser",fetchUser,async(req,res)=>{
//   console.log(req.user.userId)
//   res.send(req.user.id)
// })
app.post("/Category-Lawyer", async (req, res) => {
  const { Category } = req.body;
  console.log(req.body);
  const user = await Lawyer.find({ LawyerCat: Category });
  console.log(user);
  return res.send({ status: "ok", data: user });
});
app.post("/login-Lawyer", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const oldUser = await Lawyer.findOne({ email: email });

  if (!oldUser) {
    return res.send({ status: "null", data: "User doesn't exists!!" });
  }
  if (!(await bcrypt.compare(password, oldUser.password))) {
    return res.send({ status: "Wrongpass", data: "doesn't exists!!" });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    console.log(token);
    const token1 = oldUser._id;
    if (res.status(201)) {
      return res.send({
        status: "ok",
        data: { token, token1 },
      });
    } else {
      return res.send({ error: "error" });
    }
  }
});
app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    //update the recepient's friendRequestsArray!
    await Lawyer.findByIdAndUpdate(selectedUserId, {
      $push: { freindRequests: currentUserId },
    });

    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});
app.get("/friend-request/:LawyerId", async (req, res) => {
  try {
    
    const { LawyerId } = req.params;
    console.log(LawyerId)
    //fetch the user document based on the User id
    const LawyerData = await Lawyer.findById(LawyerId)
    // .populate("UserInfo")
    .populate({
      path: 'freindRequests',
      model: 'UserInfo', // The model to populate from
      select: 'name email' // Select specific fields from UserInfo
    })
      // .where(User).all();
    console.log(LawyerData.freindRequests)
     
    const freindRequests = LawyerData.freindRequests;

    res.json(freindRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    //retrieve the documents of sender and the recipient
    const sender = await User.findById(senderId);
    const recepient = await Lawyer.findById(recepientId);

    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    recepient.freindRequests = recepient.freindRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/accepted-friends-Lawyer/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const Lawyer1 = await Lawyer.findById(userId).populate(
      {
        path: 'friends',
        model: 'UserInfo', // The model to populate from
        select: 'name email' // Select specific fields from UserInfo
      }
    );
    const acceptedFriends = Lawyer1.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/accepted-friends-User/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      {
        path: 'friends',
        model: 'LawyerInfo', // The model to populate from
        select: 'name email' // Select specific fields from UserInfo
      }
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.listen(5001, () => {
  console.log("Node js is connected");
});

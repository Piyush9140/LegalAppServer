const mongoose = require("mongoose");

const LawyerDetailSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    location:String,
    Number: String,
    LawyerCat:String,
    LawyerID:String,
    freindRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LawyerInfo",
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LawyerInfo",
      },
    ],
    sentFriendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LawyerInfo",
      },
    ],
  },
  {
    collection: "LawyerInfo",
  }
);
mongoose.model("LawyerInfo", LawyerDetailSchema);
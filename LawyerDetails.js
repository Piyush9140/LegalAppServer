const mongoose = require("mongoose");

const LawyerDetailSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    location:String,
    Number: String,
    LawyerCat:String,
    LawyerID:String
  
  },
  {
    collection: "LawyerInfo",
  }
);
mongoose.model("LawyerInfo", LawyerDetailSchema);
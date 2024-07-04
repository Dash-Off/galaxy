import { GENDER } from "./enums/index.js";
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";


const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: GENDER.getValues(),
    required: true,
  },
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});


User.plugin(passportLocalMongoose);
const UserModel = mongoose.model("User", User);


export default UserModel;

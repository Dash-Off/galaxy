import mongoose from "mongoose";
import { DASHOFFTYPE } from "./enums/index.js";


/*

DashOff:

+ String ID
+ DashOffType type
+ String title nullable
+ String ChallengeID
+ String content
+ String scoreID nullable
+ String createdAt
+ String public default False

*/
const DashOff = new mongoose.Schema({
  type: {
    type: String,
    enum: DASHOFFTYPE.getValues(),
    required: true,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  public: {
    type: Boolean,
    required: true,
    default: false,
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
  },
  scoreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Score",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: {
    createdAt,
    updatedAt
  }
});



const DashOffModel = mongoose.model("DashOff", DashOff);


export default DashOffModel;

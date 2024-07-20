import mongoose from "mongoose";
import { DASHOFFTYPE, DASHOFF_STATUS } from "./enums/index.js";


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
  status: {
    type: String,
    enum: DASHOFF_STATUS.getValues(),
    required: true,
  },
  title: {
    type: String,
  },
  raw: {
    type: String,
  },
  markup: {
    type: String,
  },
  public: {
    type: Boolean,
    required: true,
    default: false,
  },
  challenge_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
  },
  score_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scores",
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
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});



const DashOffModel = mongoose.model("DashOff", DashOff);


export default DashOffModel;

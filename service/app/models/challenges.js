/*
challenges
+ String ID
+ String headline
+ String name
+ String description
+ String level
+ String duration
*/

import mongoose from "mongoose";

const Challenge = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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
  duration: {
    type: Number,
    default: 0, // In seconds
  }
}, {
  timestamps: {
    createdAt,
    updatedAt
  }
});



const ChallengeModel = mongoose.model("Challenge", Challenge);


export default ChallengeModel;

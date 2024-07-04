import mongoose from "mongoose";
import { EXTRA_TYPE } from "./enums/index.js";

// Extras - ID type value
const Extra = new mongoose.Schema({
  type: {
    type: String,
    enum: EXTRA_TYPE.getValues(),
    required: true,
  },
  value: {
    type: String,
    required: true,
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



const ExtraModel = mongoose.model("Extra", Extra);


export default ExtraModel;

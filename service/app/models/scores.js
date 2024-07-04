/*
Scores
+ String ID
+ String overallScore
+ String grammarScore
+ String structureScore
+ String vocabScore
+ List corrections

*/

import mongoose from "mongoose";
import { CORRECTION_TYPE } from "./enums";

const Correction = new mongoose.Schema({
  type: {
    type: String,
    enum: CORRECTION_TYPE,
    required: true
  },
  startPos: {type: Number, required: true},
  endPos: {type: Number, required: true},
  replacement: {type: String, required: true}
},{
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});


const Scores = new mongoose.Schema({
  overallScore: {
    type: Number,
    required: true,
  },
  grammarScore: {
    type: Number,
    required: true,
  },
  vocabScore: {
    type: Number,
    required: true,
  },
  structureScore: {
    type: Number,
    required: true,
  },
  corrections: [Correction],
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



const ScoresModel = mongoose.model("Scores", Scores);


export default ScoresModel;
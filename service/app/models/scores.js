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
import { CORRECTION_SUB_TYPE, CORRECTION_TYPE } from "./enums/index.js";




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
  corrections: [
    {
      correctionType: {
        type: String,
        enum: CORRECTION_TYPE.getValues(),
        required: true
      },
      suggestion: {
        type: {
          replacement: {type: String},
          pos: {type: Number},
          actual: {type: String},
          correctionSubType: {type: String, enum: CORRECTION_SUB_TYPE.getValues()}
        },
        required: false,
      },
      line: {type: Number, required: true},
      actual: {type: String, required: true},
    }
  ],
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
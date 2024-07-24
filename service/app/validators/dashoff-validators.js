import * as yup from "yup";
import {  DASHOFF_STATUS, DASHOFFTYPE  } from "../models/enums/index.js";
import { isValidObjectId } from "mongoose";

// Challenge : type, challengeId, 
export const createChallengeSchema = yup.object({
  type: yup.string().oneOf([DASHOFFTYPE.CHALLENGE]).required(),
  challenge_id: yup.string().required().test(
    "is-valid-object-id",
    "Challenge ID is not a valid Object ID",
    value => value && isValidObjectId(value)
  ),
});


// Dashoff : title, type
export const createDashOffSchema = yup.object({
  type: yup.string().oneOf([DASHOFFTYPE.SELF]).required(),
  title: yup.string().required("Please provide a valid title"),
});

// Save DashOff : content
export const saveDashOffSchema = yup.object({
  dash_off_id: yup.string().required().test(
    "is-valid-object-id",
    "DashOff ID is not a valid Object ID",
    value => value && isValidObjectId(value)
  ),
  markup: yup.string(),
  raw: yup.string(),
});

export const updateDashOffSchema = yup.object({
  dash_off_id: yup.string().required().test(
    "is-valid-object-id",
    "DashOff ID is not a valid Object ID",
    value => value && isValidObjectId(value)
  ),
  status: yup.string().oneOf([DASHOFF_STATUS.EXPIRED, DASHOFF_STATUS.COMPLETED]),
  public: yup.boolean(),
});

// Save DashOff : content
export const completeDashOffSchema = yup.object({
  dash_off_id: yup.string().required().test(
    "is-valid-object-id",
    "DashOff ID is not a valid Object ID",
    value => value && isValidObjectId(value)
  )
});

const suggestionSchema =  yup.object({
    replacement: yup.string(),
    pos: yup.number(),
    actual: yup.string(),
    correctionSubType: yup.string(),
}).notRequired();

const correctionSchema = yup.object({
  correctionType: yup.string().required(),
  suggestion: suggestionSchema,
  line: yup.string().required(),
  actual: yup.string().required()
})

// Save scores
export const resultSchema = yup.object({
  overallScore: yup.number().required(),
  grammarScore: yup.number().required(),
  structureScore: yup.number().required(),
  vocabScore: yup.number().required(),
  corrections: yup.array().of(correctionSchema),
});

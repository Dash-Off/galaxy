import * as yup from "yup";
import {  DASHOFFTYPE  } from "../models/enums/index.js";
import { isValidObjectId } from "mongoose";

// Challenge : type, challengeId, 
export const createChallengeSchema = yup.object({
  type: yup.string().oneOf(DASHOFFTYPE.CHALLENGE).required(),
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

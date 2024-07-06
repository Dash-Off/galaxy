import validators from "../validators/index.js";
import {  ValidationError, validateSchema} from '../utility.js';
import { setError, setResponse } from "./response-handler.js";
import { DASHOFFTYPE, DASHOFF_STATUS } from "../models/enums/index.js";
import dashOffService from "../services/dashoff-service.js";
import mongoose from "mongoose";


export const createChallengeDashOff = async (request, response) => {
  try{
    let challengeData  = validateSchema(validators.dashOff.createChallengeSchema, request.body);

    const activeChallenge = await dashOffService.getActiveChallenge(request.user._id);
    if (activeChallenge) {
      ValidationError("Complete active challenge !")
    }
    const existingChallenge = await dashOffService.findExistingChallenge(request.user._id, challengeData.challenge_id);
    if (existingChallenge) {
      ValidationError("You are already part of this challenge !")
    }

    const challengeDashOff = await dashOffService.save({
      type: DASHOFFTYPE.CHALLENGE,
      challenge_id: new mongoose.Types.ObjectId(challengeData.challenge_id),
      status: DASHOFF_STATUS.ACTIVE,
      createdBy: request.user._id,
      modifiedBy: request.user._id,
    });
    setResponse({
      message: "Unlocked challenge!",
      dashOff: challengeDashOff,
    }, response);
  } catch(e) {
    console.log(e);
    setError(e, response);
  }
};


export const createSelfDashOff = async (request, response) => {
  try{
    let selfDashOffData  = validateSchema(validators.dashOff.createDashOffSchema, request.body);

    /*
    *** Enable when you need to avoid multiple dashoff******
    const activeDashOff = await dashOffService.getActiveSelfDashOff(request.user._id);
    if (activeDashOff) {
      ValidationError("Complete active challenge !")
    }
    */
    const selfDashOff = await dashOffService.save({
      type: DASHOFFTYPE.SELF,
      title: selfDashOffData.title,
      status: DASHOFF_STATUS.ACTIVE,
      createdBy: request.user._id,
      modifiedBy: request.user._id,
    });
    setResponse({
      message: "Explore your writing !!",
      dashOff: selfDashOff,
    }, response);
  } catch(e) {
    console.log(e);
    setError(e, response);
  }
};


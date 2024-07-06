import validators from "../validators/index.js";
import {  NotFound, ValidationError, validateSchema} from '../utility.js';
import { setError, setResponse } from "./response-handler.js";
import { DASHOFFTYPE, DASHOFF_STATUS } from "../models/enums/index.js";
import dashOffService from "../services/dashoff-service.js";
import challengeService from "../services/challenge-service.js";
import { TIMEOUT_ERROR_CODE } from "../constants.js";
import dashoffService from "../services/dashoff-service.js";


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

    const challenge = await challengeService.find(challengeData.challenge_id)

    const challengeDashOff = await dashOffService.save({
      type: DASHOFFTYPE.CHALLENGE,
      challenge_id: challenge._id,
      status: DASHOFF_STATUS.ACTIVE,
      createdBy: request.user._id,
      modifiedBy: request.user._id,
    });
    setResponse({
      message: "Unlocked challenge!",
      dashOff: challengeDashOff,
      challenge,
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


export const saveDashOff = async (request, response) => {
  try{
    let dashOffData  = validateSchema(validators.dashOff.saveDashOffSchema, request.body);

    // DashOff exists and active and timed
    let dashOff = await dashOffService.getDashOffByUserId(request.user._id, dashOffData.dash_off_id);
    if(!dashOff) {
      NotFound("Dashoff not found !");
    }

    if (!dashOff.status == DASHOFF_STATUS.ACTIVE) [
      ValidationError("Cannot edit dashoff !", {"code": TIMEOUT_ERROR_CODE})
    ]

    if (dashOff.type == DASHOFFTYPE.CHALLENGE) {
      console.log(dashOff.challenge_id)
      const challenge = await challengeService.find(dashOff.challenge_id);
      if (challenge.duration) {
        const now = Date.now();
        const threshold = now - (challenge.duration + SAVE_DASHOFF_ADDITIONAL_THRESHOLD_SECONDS) * 1000;
        const startTime =  new Date(dashOff.createdAt).getTime();
        if (startTime < threshold) {
          ValidationError("Time out cannot save any more content..")
        }
      }
    }
    
    dashOff.content = dashOffData.content;
    dashOff.save();

    setResponse({
      message: "Saved !",
      dashOff,
    }, response);
  } catch(e) {
    console.log(e);
    setError(e, response);
  }
};

export const list = async (request, response) => {
  try {
    const dashOffs = await dashoffService.getAllByUserId(request.user._id);
    setResponse(dashOffs, response);
  } catch(error) {
    console.log(error);
    setError(error, response);
  }
}

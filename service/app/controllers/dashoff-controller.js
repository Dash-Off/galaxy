import validators from "../validators/index.js";
import {  NotFound, ValidationError, validateSchema} from '../utility.js';
import { setError, setResponse } from "./response-handler.js";
import { DASHOFFTYPE, DASHOFF_STATUS } from "../models/enums/index.js";
import dashOffService from "../services/dashoff-service.js";
import challengeService from "../services/challenge-service.js";
import { SAVE_DASHOFF_ADDITIONAL_THRESHOLD_SECONDS, TIMEOUT_ERROR_CODE } from "../constants.js";
import dashoffService from "../services/dashoff-service.js";
import userService from "../services/user-service.js";
import scoreService from "../services/score-service.js";
import { ADMIN_USER_ID } from '../../config.js';


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

    if (dashOff.status !== DASHOFF_STATUS.ACTIVE) {
      ValidationError("Cannot edit dashoff !")
    }

    if (dashOff.type == DASHOFFTYPE.CHALLENGE) {
      console.log(dashOff.challenge_id)
      const challenge = await challengeService.find(dashOff.challenge_id);
      if (challenge.duration) {
        const now = Date.now();
        const threshold = now - ((challenge.duration + SAVE_DASHOFF_ADDITIONAL_THRESHOLD_SECONDS) * 1000);
        const startTime =  new Date(dashOff.createdAt).getTime();
        //console.log(startTime, threshold)
        if (startTime < threshold) {
          ValidationError("Time out cannot save any more content..", {"code": TIMEOUT_ERROR_CODE})
        }
      }
    }
    
    dashOff.raw = dashOffData.raw;
    dashOff.markup = dashOffData.markup;
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

export const updateDashOff = async (request, response) => {
  try{
    let dashOffData  = validateSchema(validators.dashOff.updateDashOffSchema, request.body);

    // DashOff exists and active and timed
    let dashOff = await dashOffService.getDashOffByUserId(request.user._id, dashOffData.dash_off_id);
    if(!dashOff) {
      NotFound("Dashoff not found !");
    }
    if (dashOffData.status) {
      if (dashOff.status !== DASHOFF_STATUS.ACTIVE) {
        ValidationError("Cannot update dashoff !")
      }
      
      dashOff.status = dashOffData.status;
    }
    if (dashOffData.public !== undefined) {
      dashOff.public = !!dashOffData.public;
    }
    
    dashOff.save();

    setResponse({
      message: "Updated status !",
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

const getViewModeDashOff = async (dashOff) => {
  const owner = await userService.find(dashOff.createdBy);
  return {
    type: "View",
    id: dashOff._id,
    author: owner.name,
    title: dashOff.title,
    raw: dashOff.raw,
    markup: dashOff.markup,
  }
}

const getDashOffInfo = (dashOff, challenge, scores) => {
  return {
    type: "Owner",
    dashOff,
    challenge,
    scores,
  }
}

export const getDashOff = async (request, response) => {
  try {
    console.log(request.params.id)
    const dashOff = await dashoffService.find(request.params.id);
    if (!dashOff) {
      console.log("No dashoff")
      NotFound("DashOff does not exist !")
    }

    const viewMode = request.query.view;
    if (!dashOff.createdBy.equals(request.user._id)) {
      if (dashOff.public && viewMode) {
        let viewabledashOff = await getViewModeDashOff(dashOff);
        setResponse(viewabledashOff, response)
      } else {
        NotFound("Dashoff does not exist !")
      }
    } else {
      if (viewMode) {
        let viewabledashOff = await getViewModeDashOff(dashOff);
        setResponse(viewabledashOff, response)
      } else {
        let scores = {};
        let challenge = {};
        if (dashOff.score_id) {
          scores = await scoreService.find(dashOff.score_id)
        }
        if (dashOff.type === DASHOFFTYPE.CHALLENGE) {
          challenge = await challengeService.find(dashOff.challenge_id)
        }
        setResponse(
          getDashOffInfo(dashOff, challenge, scores),
          response
        );
      }
    }
    
  } catch(error) {
    console.log(error);
    setError(error, response);
  }
}


export const completeDashOff = async (request, response) => {
  try{
    let dashOffData  = validateSchema(validators.dashOff.completeDashOffSchema, request.body);

    let dashOff = await dashOffService.getDashOffByUserId(request.user._id, dashOffData.dash_off_id);
    if(!dashOff) {
      NotFound("Dashoff not found !");
    }

    if (!dashOff.status == DASHOFF_STATUS.ACTIVE) {
      ValidationError("DashOff is complete !")
    }

    // Trigger dashoff results endpoint
    // Lambda integration
    
    dashOff.status = DASHOFF_STATUS.COMPLETED;
    dashOff.save();

    setResponse({
      message: "Completed !",
      dashOff,
    }, response);
  } catch(e) {
    console.log(e);
    setError(e, response);
  }
};



export const postResult = async (request, response) => {
  try{
    let resultData  = validateSchema(validators.dashOff.resultSchema, request.body);

    let dashOff = await dashOffService.find(request.params.id);
    if(!dashOff) {
      NotFound("Dashoff not found !");
    }

    if (DASHOFF_STATUS.COMPLETED !== dashOff.status) {
      ValidationError("DashOff is not complete !")
    }

    const score = await scoreService.save({...resultData, createdBy: ADMIN_USER_ID, modifiedBy: ADMIN_USER_ID});
    dashOff.score_id = score._id
    dashOff.status = DASHOFF_STATUS.EVALUATED;
    dashOff.save();

    setResponse({
      message: "Results Updated !",
    }, response);
  } catch(e) {
    console.log(e);
    setError(e, response);
  }
};



import Models from "../models/index.js";
import genericService from "./generic-service.js";
import { DASHOFF_STATUS } from "../models/enums/index.js";

const findExistingChallenge = async (userId, challengeId) => {
  const challenge = await Models.DashOff.findOne({
    createdBy: userId,
    challengeId,

  }).exec();
  return challenge;
}


const getActiveChallenge = async (userId) => {
  const activeChallenge = await Models.DashOff.findOne({
    createdBy: userId,
    status: DASHOFF_STATUS.ACTIVE,
    challengeId: { $ne: null, $ne: '' }
  }).exec();
  return activeChallenge;
}

const getActiveSelfDashOff = async (userId) => {
  const activeSelfDashOff = await Models.DashOff.findOne({
    createdBy: userId,
    status: DASHOFF_STATUS.ACTIVE,
    challengeId: { $in: [null, ''] }
  }).exec();
  return activeSelfDashOff;
}

export default {
  ...genericService(Models.DashOff),
  getActiveChallenge,
  findExistingChallenge,
  getActiveSelfDashOff,
}
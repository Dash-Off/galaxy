import Models from "../models/index.js";
import genericService from "./generic-service.js";
import { DASHOFF_STATUS } from "../models/enums/index.js";

const findExistingChallenge = async (userId, challenge_id) => {
  const challenge = await Models.DashOff.findOne({
    createdBy: userId,
    challenge_id,
    status: {$ne: DASHOFF_STATUS.EXPIRED}
  }).exec();
  return challenge;
}


const getActiveChallenge = async (userId) => {
  const activeChallenge = await Models.DashOff.findOne({
    createdBy: userId,
    status: DASHOFF_STATUS.ACTIVE,
    challenge_id: { $ne: null }
  }).exec();
  return activeChallenge;
}

const getActiveSelfDashOff = async (userId) => {
  const activeSelfDashOff = await Models.DashOff.findOne({
    createdBy: userId,
    status: DASHOFF_STATUS.ACTIVE,
    challenge_id: { $in: [null] }
  }).exec();
  return activeSelfDashOff;
}


const getDashOffByUserId = async (userId, dashOffId) => {
  const activeDashOff = await Models.DashOff.findOne({
    createdBy: userId,
    _id: dashOffId,
  })
  return activeDashOff;
}


const getAllByUserId = async (userId) => {
  const dashOffs = await Models.DashOff.find({createdBy: userId}).sort({createdDate: -1}).exec();
  return dashOffs;
}


const getAttemptedChallenge = async (userId) => {
  const attemptedChallenges = await Models.DashOff.find({
    createdBy: userId,
    challenge_id: { $ne: null }
  }).populate('challenge_id').sort("challenge_id.order").exec();
  return attemptedChallenges;
}

export default {
  ...genericService(Models.DashOff),
  getActiveChallenge,
  findExistingChallenge,
  getActiveSelfDashOff,
  getDashOffByUserId,
  getAllByUserId,
  getAttemptedChallenge,
}
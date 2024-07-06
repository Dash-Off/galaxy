import ChallengeModel from './challenges.js';
import DashOffModel from './dashoff.js';
import ExtraModel from './extras.js';
import User from './user.js';
import ScoresModel from './scores.js'



export default {
  User,
  Extra: ExtraModel,
  DashOff: DashOffModel,
  Challenge: ChallengeModel,
  Score: ScoresModel
};

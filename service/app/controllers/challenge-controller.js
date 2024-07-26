import { setError, setResponse } from "./response-handler.js";
import dashOffService from "../services/dashoff-service.js";
import challengeService from "../services/challenge-service.js";
import { DASHOFF_STATUS } from "../models/enums/index.js";

/* Format challenge and next challenge for display */
const formatChallengeCards = (challenges, nextChallenge) => {
  const cards = []
  let challenge = {}
  for(challenge of challenges) {
    cards.push({
      order: challenge.challenge_id.order,
      name: challenge.challenge_id.name,
      headline: challenge.challenge_id.headline,
      description: challenge.challenge_id.description,
      dash_off_id: challenge.id,
      challenge_id: challenge.challenge_id._id,
      duration: challenge.challenge_id.duration,
      status: challenge.status,
      created_at: challenge.createdAt,
    })
  }
  if (nextChallenge) {
    cards.push({
      order: nextChallenge.order,
      name: nextChallenge.name,
      challenge_id: nextChallenge._id,
      locked: DASHOFF_STATUS.ACTIVE == challenge.status, // Lock if the last challenge is active
      headline: DASHOFF_STATUS.ACTIVE == challenge.status ? "": nextChallenge.headline,// Do not send headline if locked
    })
  }
  return cards;
  
}

export const listUserChallenges = async (request, response) => {
  try {
    const attemptedChallenges = await dashOffService.getAttemptedChallenge(request.user._id);

    let lastAttemptedChallengeOrder = 0;
    if (attemptedChallenges.length) {
      attemptedChallenges.sort((a,b) => b.challenge_id.order - a.challenge_id.order)
      lastAttemptedChallengeOrder = attemptedChallenges[attemptedChallenges.length - 1].challenge_id.order;
    }
    
    const nextChallenge = await challengeService.getByOrderId(lastAttemptedChallengeOrder + 1);

    /**Remove this after testing */
    const DEFAULTNEXTCHALLENGE = {
      order: 69,
      name: "Nothing next challenge",
      headline: "Come back after the challenges are added",
      challenge_id: 0,
    }
    /** */

    let challenges = formatChallengeCards(attemptedChallenges, nextChallenge || DEFAULTNEXTCHALLENGE);

    setResponse(challenges, response);
  } catch(error) {
    console.log(error);
    setError(error, response);
  }
}

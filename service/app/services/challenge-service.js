import Models from "../models/index.js";
import genericService from "./generic-service.js";

const getByOrderId = async (orderId) => {
  console.log(orderId)
  const challenge = await Models.Challenge.findOne({order: orderId}).exec();
  return challenge;
}

export default {
  ...genericService(Models.Challenge),
  getByOrderId,
}
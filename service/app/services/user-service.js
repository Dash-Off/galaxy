import Models from "../models/index.js";
import genericService from "./generic-service.js";

export default {
  ...genericService(Models.User),
}
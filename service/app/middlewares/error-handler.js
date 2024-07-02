import { setError } from "../controllers/response-handler.js";

function errorHandler(error, req, response, next) {
  console.log("Handling erorr.......");
  console.log(error);
  setError(error, response);
}


export default errorHandler;

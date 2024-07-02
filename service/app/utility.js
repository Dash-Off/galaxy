import express from 'express';
import { BAD_REQUEST_STATUS_CODE, FORBIDDEN_STATUS_CODE, NOT_FOUND_STATUS_CODE, UNAUTHORIZED_STATUS_CODE } from "./constants.js";
import authenticate from "./middlewares/authentication.js";
import { ADMINS, IMAGE_UPLOAD_URL } from '../config.js';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const getDate = date => {
  let dateObj = new Date(date);
  if (dateObj.toString() === "Invalid Date") {
    return null;
  }
  return dateObj;
};


export const validateMandatoryFields = (fields, data) => {
  fields.forEach(field => {
    if (data[field] === undefined) {
      ValidationError(`${field} is mandatory`);
    }
  });
}
const BaseError = (status, message, extra={}, raise=true) => {
  const error = {status, body: {message, extra}};
  if(!raise) {
    return error;
  } else {
    throw error;
  }
};

export const ValidationError = (message, extra={}, raise=true) => {
  return BaseError(BAD_REQUEST_STATUS_CODE, message, extra, raise);
};

export const NotFound = (message, extra={}, raise=true) => {
  return BaseError(NOT_FOUND_STATUS_CODE, message, extra, raise);
};
export const InternalServerError = (message, extra={}, raise=true) => {
  return BaseError(INTERNAL_SERVER_ERROR_STATUS_CODE, message, extra, raise);
};

export const Unauthorized = (message, extra={}, raise=true) => {
  return BaseError(UNAUTHORIZED_STATUS_CODE, message, extra, raise);
}
export const Forbidden = (message, extra={}, raise=true) => {
  return BaseError(FORBIDDEN_STATUS_CODE, message, extra, raise);
}

/**
 * Returns a router with auth check middleware if withAuth is true
 * @param {boolean} withAuth 
 * @param {boolean} withAdmin - Validates admin specific endpoints 
 * @returns express.Router
 */
export const getRouter = (withAuth=false, withAdmin=false) => {
  const router = express.Router();
  if (withAuth) router.use(authenticate(withAdmin));
  return router;
}


export const validateAdmin = (user) => {
  if(!ADMINS.includes(user.username)) {
    Forbidden("You are not allowed to access this resource !");
  }
};

export const validateSchema = (schema, data) => {
  let validatedData;
  console.log(data);
  try {
    validatedData = schema.validateSync(data);
  } catch (e) {
    console.log(e);
    ValidationError(e.errors[0], {others: e.errors});
  }
  return validatedData;
}

/**
 * Upload the image file to file server
 * @param {Image} imageBuffer 
 * @param {String} fileName 
 * @returns 
 */
export function uploadImage(imageBuffer, fileName, contentType) {
  const form = new FormData();
  form.append('image', imageBuffer, {
    contentType,
    filename: fileName,
  });
  return fetch(IMAGE_UPLOAD_URL, { method: 'POST', body: form }).then(response => response.json())
};

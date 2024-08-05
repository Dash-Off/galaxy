import getClient from "./client.js";
import { ASYNC_JOB_HOST, ASYNC_JOB_PORT } from "../../config.js";
import crypto from 'crypto';
import axios from "axios";

const getSignature  = (payload) => {
  let signedString = 'signed,';
  Object.keys(payload).forEach(k => signedString += `${k},`);

  const hmac = crypto.createHmac('sha256', process.env.APP_SECRET).update(signedString).digest('hex');
  return btoa(hmac);
};

export const validateInterAuthRequest = (req) => {
  const headers = req.headers;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const body = req.body || {};
  const whitelistIps = (process.env.WHITELIST_IPS || "").split(",");
  if (!Object.keys(headers).includes("X_AUTH") || whitelistIps.includes(ipAddress)) {
    console.log(`Client IP: ${ipAddress}`);
    return false;
  }
  return headers["X_AUTH"] == getSignature(body)

}



// The below function does it through custom RPC, use this when moved to prviate server
export const evaluateDashOff = async (dashOffId, rawText) => {
  let client = getClient(ASYNC_JOB_HOST, ASYNC_JOB_PORT)

  await client.connect()
  client.getResult(dashOffId, rawText).then(data => {
    console.log(data)
  }).catch(e => {console.log(e)})
  client.disconnect()
};

// Below function makes a HTTP request
export const requestEvaluation = async (dashOffId, rawText) => {
  const payload = {dashOffId, raw: rawText}
  return axios.post(
    `${process.env.EVAL_APP_HOST}/api/v1/get_scores`,
    payload,
    {headers: {
      "X_AUTH": getSignature(payload)
    }}).then(({data}) => {
      console.log(data.message);
  }).catch(e => {
    console.error(`Failed to request evaluation : ID-${dashOffId}`)
    console.error(e);
  })
}


import getClient from "./client";
import { ASYNC_JOB_HOST, ASYNC_JOB_PORT } from "../../config";
export const evaluateDashOff = async (dashOffId, rawText) => {
  let client = getClient(ASYNC_JOB_HOST, ASYNC_JOB_PORT)

  await client.connect()
  client,getResult(dashOffId, rawText).then(data => {
    console.log(data)
  }).catch(e => {console.log(e)})
  client,disconnect()
};


/*

  Airtable webhook functions 

  0. Modify the shipping status of a record in the Airtable contacts db.
  1. Airtable will send a webhook to this function when there is a change to the status field
  2. Runs getCursor() to get the index of the last change
  3. Runs getPayload() to fetch the webhook payload.
  4. Runs getRecordId() to extract the recordId from the insane payload. (There's got to be a better way to do this)
  5. Do whatever you want with the recordId. I'm using it in the owlibaba-functions to send shipping notifications.
  
*/

require("dotenv").config()
const axios = require("axios").default
const apiKey = process.env.AIRTABLE_API_KEY
const baseId = process.env.AIRTABLE_BASE_ID

let apiUrl = ""
let config = {}
let webhookPayloadId = ""
let cursor = 0
console.log("Initialize cursor ==>", cursor)
let payloadObject = {}

async function getCursor() {
  console.log("START GET CURSOR")
  apiUrl = `https://api.airtable.com/v0/bases/${baseId}/webhooks`
  config = {
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  }
  try {
    const response = await axios(config)
    console.log("RESPONSE.STATUS:", response.status)
    console.log("RESPONSE.STATUSTEXT:", response.statusText)
    console.log("RESPONSE.DATA:", response.data)
    webhookPayloadId = response.data.webhooks[0].id
    console.log("webhookPayloadId is ==>", webhookPayloadId)
    cursor = response.data.webhooks[0].cursorForNextPayload - 1
    console.log("cursor is ==>", cursor)
    console.log("END GET CURSOR")
    // console.log(response);
  } catch (error) {
    console.log("ERROR:", error)
    console.log("ERROR.MESSAGE:", error.message)
    // console.error(error);
  }
}

async function getPayload() {
  console.log("START GET PAYLOAD")
  apiUrl = `https://api.airtable.com/v0/bases/${baseId}/webhooks/${webhookPayloadId}/payloads?cursor=${cursor}`
  config = {
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  }
  try {
    const response = await axios(config)
    console.log("RESPONSE.STATUS:", response.status)
    console.log("RESPONSE.STATUSTEXT:", response.statusText)
    console.log("RESPONSE.DATA:", response.data)
    payloadObject = response.data
    console.log("END GET PAYLOAD")
    // console.log(response);
  } catch (error) {
    console.log("ERROR:", error)
    console.log("ERROR.MESSAGE:", error.message)
    // console.error(error);
  }
}

async function getRecordId() {
  const recordId = await Object.entries(
    Object.entries(
      Object.entries(
        Object.entries(
          Object.entries(Object.entries(payloadObject)[0][1][0])[4]
        )[1][1]
      )[0][1]
    )[0][1]
  )[0][0]
  console.log("recordId", recordId)
}

// Run all the functions
getCursor().then(() => {
  console.log("GET CURSOR THEN")
  getPayload().then(() => {
    console.log("GET PAYLOAD THEN")
    getRecordId().then(() => {
      console.log("GET RECORD ID THEN")
    })
  })
})

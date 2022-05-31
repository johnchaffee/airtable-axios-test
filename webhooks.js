require("dotenv").config()
const axios = require("axios").default
const apiKey = process.env.AIRTABLE_API_KEY
const baseId = process.env.AIRTABLE_BASE_ID

// These are Airtable webhook functions
// Airtable will notify when there is a change to a field
// You then need to get the cursor (index) of the last change
// Then fetch the webhook payload
// Then parse the insane payload to get the recordId
// Then you can do something with that record

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

function getRecordId() {
  const recordId = Object.entries(
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
    getRecordId()
  })
})

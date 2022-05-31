/*

  Airtable CRUD operations. Sample functions for:

  1. Get all records
  2. Get record by ID
  3. Create record
  4. Update record
  5. Delete record
  
*/

require("dotenv").config()
const apiKey = process.env.AIRTABLE_API_KEY
const baseId = process.env.AIRTABLE_BASE_ID
const tableName = "contacts"
console.log("apiKey: ", apiKey)
console.log("baseId:", baseId)
console.log("tableName:", tableName)
const axios = require("axios").default

// SAMPLE OBJECTS
let recordId = ""

const newRecord = {
  fields: {
    first: "Tom",
    last: "Jones",
    company: "Twilo",
    phone: "+12063997777",
    email: "tom@jones.com",
    notes: "My new record",
    status: "Processing",
    image: [
      {
        url: "https://dl.airtable.com/.attachments/23eeb10f0e3a7227cab008cddba6306f/edfe20e5/1620941011345e1655337600vbetatLe-TVOGWtxF-bD72N6gqqe5yjw7clPwwxpqOn8FaA8M?ts=1650072651&userId=usrn5iPjnuISAI40K&cs=1c8866d3deb42add",
      },
    ],
  },
}

const updatedRecord = {
  fields: {
    first: "Tommy",
    notes: "Updated record",
    status: "Shipped",
  },
}

// GET RECORDS
const getRecords = async () => {
  console.log("GET RECORDS")
  const options = {
    url: `https://api.airtable.com/v0/${baseId}/${tableName}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  }
  console.log("options:", options)

  try {
    const { data } = await axios(options)
    const { records } = data
    console.log("records:", records)
    records.forEach(function (record) {
      console.log("Retrieved", record.fields.name)
      console.log("id:", record.id)
      console.log(record.fields)
    })
  } catch (err) {
    console.error(err)
  }
}

// GET RECORD BY ID
const getRecordById = async (id) => {
  console.log("GET RECORD BY ID")
  const options = {
    url: `https://api.airtable.com/v0/${baseId}/${tableName}/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  }
  console.log("options:", options)
  try {
    const { data } = await axios(options)
    const record = data
    console.log("RECORD:", record)
    console.log("FIELDS:", record.fields)
  } catch (err) {
    console.error(err)
  }
}

// CREATE RECORD
const createRecord = async (fields) => {
  console.log("CREATE RECORD")
  const options = {
    url: `https://api.airtable.com/v0/${baseId}/${tableName}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    data: fields,
  }
  console.log("options:", options)
  try {
    const { data } = await axios(options)
    const record = data
    console.log("record id:", record.id)
    recordId = record.id
    console.log("record fields:", record.fields)
  } catch (err) {
    console.error(err)
  }
}

// UPDATE RECORD
// table.update is a PATCH and updates only provided values
// table.replace is an PUT and overwrites all fields, even those not provided
const updateRecord = async (id, fields) => {
  console.log("UPDATE RECORD")
  const options = {
    url: `https://api.airtable.com/v0/${baseId}/${tableName}/${id}`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    data: fields,
  }
  console.log("options:", options)
  try {
    const { data } = await axios(options)
    const record = data
    console.log("record id:", record.id)
    console.log("record fields:", record.fields)
  } catch (err) {
    console.error(err)
  }
}

// DELETE RECORD
const deleteRecord = async (id) => {
  console.log("DELETE RECORD")
  const options = {
    url: `https://api.airtable.com/v0/${baseId}/${tableName}/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  }
  console.log("options:", options)
  try {
    const { data } = await axios(options)
    console.log("DATA:", data)
  } catch (err) {
    console.error(err)
  }
}

// RUN THE FUNCTIONS

// getRecords()
// createRecord(newRecord)
// getRecordById(recordId)
// updateRecord(recordId, updatedRecord)
// deleteRecord(recordId)

createRecord(newRecord)
  .then(function () {
    console.log("UPDATE RECORD THEN")
    updateRecord(recordId, updatedRecord)
  })
  .then(function () {
    console.log("DELETE RECORD THEN")
    deleteRecord(recordId)
  })
  .catch(function (err) {
    console.log(err)
  })

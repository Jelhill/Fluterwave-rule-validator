const express = require("express")
const router = express.Router()

const data = {
    "data": {
      "name": "Abduljelili Osigbemhe Umaru",
      "github": "@jelhill",
      "email": "talk2jelili2000@gmail.com",
      "mobile": "08036792165",
      "twitter": "@jelhill"
    }
  }


valData = {
    "rule": {
      "field": "0",
      "condition": "gte",
      "condition_value": 40
    },
    // "data": {
    //   "name": "James Holden",
    //   "crew": "Rocinante",
    //   "age": 34,
    //   "position": "Captain",
    //   "missions": {
    //     "count": 45,
    //     "successful": 44,
    //     "failed": 1
    //   }      
      "data": [40, 25, "Hello"]
    // }
    // "data": "missions"
      // "data": ["missions", "Hi"]
  }

router.get("/", (req, res) => {
    res.status(200)
    .json({
      message: "My Rule-Validation API", 
      status: "success", 
      data
    })
})

router.post("/validate-rule", (req, res) => {
  req.body = valData
  
  if(req.body.rule === undefined && req.body.data === undefined) {
    return res.json({
      message: "rule and data is required.",
      status: "error",
      data: null
    })      
  }
  
  if(req.body.data === undefined) {
    return res.json({
      message: "data is required.",
      status: "error",
      data: null
    })      
  }
  
  if(req.body.rule === undefined) {
    return res.json({
      message: "rule is required.",
      status: "error",
      data: null
    })      
  }
  
  if( Array.isArray(req.body.rule)) {
    return res.json({
      message: "rule should be an object",
      status: "error",
      data: null
    })      
  }

  if( typeof req.body.rule !== "object") {
    return res.json({
      message: "rule should be an object.",
          status: "error",
          data: null
      })      
  }
    
  let fieldToArray = req.body.rule.field.split(".")
  let fieldType
  let field_value
  let condition = req.body.rule.condition
  let condition_value = req.body.rule.condition_value

  
    if(Array.isArray(req.body.data)) {
      field_value = req.body.data
      if(fieldToArray.length > 1) {
        return res
          .status(400)
          .json({
            message: `${fieldToArray[0]} should be an object.`,
            status: "error",
            data: null
          })
      }
    }
    

    // Validate rules fields
    let requiredRuleFields = ["field", "condition", "condition_value"]
    let receivedRuleFields = Object.keys(req.body.rule)
    let missingRuleField = []

    requiredRuleFields.forEach(field => {
      if(!receivedRuleFields.includes(field)){
        missingRuleField.push(field)
      }
    })


    if(missingRuleField.length) {
      return res
        .status(400)
        .json({
        message: `${String(missingRuleField)} is required.`,
        status: "error",
        data: null
    })
    }
    

    if(fieldToArray.length > 1) {
      fieldType = "object"
    }

    if(typeof req.body.data === "string") {

      
    }


    console.log("Options", Object.keys(req.body.data))
    console.log("body data", req.body.data)
    if(Array.isArray(req.body.data) === false && fieldToArray.length === 1 && !Object.keys(req.body.data).includes(fieldToArray[0])) {
      return res.status(400).json({
        message: `field ${fieldToArray[0]} is missing from data.`,
        status: "error",
        data: null
      })
    }

    if(fieldToArray.length > 1 && !Object.keys(req.body.data[fieldToArray[0]]).includes(fieldToArray[1])) {
      return res.status(400).json({
        message: `field ${fieldToArray[1]} is missing from data.`,
        status: "error",
        data: null
      })
    }


    // Check to see if the field Matches the data.field.
    if(Object.keys(req.body.data).includes(fieldToArray[0])){
      if(fieldToArray.length === 3) {
        if(typeof req.body.data[fieldToArray[0]] !== "object"){
          return res
          .status(400)
          .json({
            message: `${fieldToArray[0]} should be an ${typeof fieldToArray[0]}.`,
            status: "error",
            data: null
          })
        }
      }
    }


    if(fieldToArray.length === 1 && !Array.isArray(req.body.data)) {
      field_value = req.body.data[fieldToArray[0]]
    }
    
    if(fieldToArray.length === 2 && !Array.isArray(req.body.data)) {
      field_value = req.body.data[fieldToArray[0]][fieldToArray[1]]
    }


    console.log(field_value, condition, condition_value)

    let conditionPassed
    if(condition === "eq") {
      field_value === condition_value ? conditionPassed = true : conditionPassed = false
    }

    if(condition === "neq") {
      field_value !== condition_value ? conditionPassed = true : conditionPassed = false
    }

    if(condition === "gt") {
      field_value > condition_value ? conditionPassed = true : conditionPassed = false
    }

    if(condition === "gte") {
      field_value >= condition_value ? conditionPassed = true : conditionPassed = false
    }

    if(condition === "contains") {
      field_value.includes(condition_value) ? conditionPassed = true : conditionPassed = false
    }

    if(conditionPassed === false) {
      return res.status(400)
      .json({
        message: `field ${fieldToArray[0]} failed validation.`,
        status: "error",
        data: {
          validation: {
            error: true,
            field: fieldToArray[0],
            field_value: field_value,
            condition: condition,
            condition_value: condition_value
          }
        }
      })
    }


    res.status(200)
    .json({
      message: `field ${req.body.rule.field} successfully validated.`,
      status: "success",
      data: {
        validation: {
          error: false,
          field: req.body.rule.field,
          field_value: 45,
          condition: req.body.rule.condition,
          condition_value: req.body.rule.condition_value
        }
      }
    })

})


module.exports = router
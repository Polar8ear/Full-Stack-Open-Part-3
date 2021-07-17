/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const URI = process.env.MONGODB_URI
const option ={ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }

console.log(`Connecting to ${URI}`)

mongoose.connect(URI,option)
  .then(_response => console.log('Connected to MongoDB'))
  .catch(error => console.log(`error connecting to MongoDB\n ${error.message}`))

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength:3,
    required:true,
    unique:true
  },
  number: {
    type:String,
    minLength:8,
    required:true
  }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON',{
  transform: (_document,returnedObject) => {
    returnedObject.id=returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person',personSchema)
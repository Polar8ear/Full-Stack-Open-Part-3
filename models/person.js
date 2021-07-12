const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI
const option ={ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }

console.log(`Connecting to ${URI}`)

mongoose.connect(URI,option)
        .then(response=>console.log('Connected to MongoDB'))
        .catch(error=>console.log(`error connecting to MongoDB\n ${error.message}`))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON',{
    transform: (document,returnedObject) =>{
        returnedObject.id=returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person',personSchema)
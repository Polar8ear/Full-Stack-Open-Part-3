const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }
  
const password =  encodeURI(process.argv[2])

  
const url =
  `mongodb+srv://fullstackopen:${password}@cluster0.o02tx.mongodb.net/phonebook`

const option ={ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }

mongoose.connect(url,option)
        .catch(error=>console.log('error\n',error))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
    Person.find({}).then(result=>{
        console.log('Phonebook:')
        result.forEach(note=>{
            console.log(`${note.name} ${note.number}`);
        })
        mongoose.connection.close()
    }).catch(()=>console.log("error in find"))
}

if(process.argv.length > 3 && process.argv.length <= 5){

  
  const newPersonName = process.argv[3]
  const newPersonNumber = process.argv[4]
  const person = new Person({
    name: newPersonName,
    number: newPersonNumber
  })

  person.save().then(result => {
    console.log(`Added ${newPersonName} ${newPersonNumber}`)
    mongoose.connection.close()
  })
}

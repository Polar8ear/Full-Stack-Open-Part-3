require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('POST-data',(req,res)=>{
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :POST-data'))
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons',(request,response) =>{
    Person.find({}).then(persons=>response.json(persons))
})

app.get('/api/persons/:id',(request,response) =>{
    const id=request.params.id
    console.log(request.params);
    Person.findById(id).then(person=>response.json(person))
                       .catch(error=>response.status(404).end())
})

app.post('/api/persons',(request,response) =>{
  const body = request.body

  if(!body.name||!body.number){
    return response.status(400).json({
      error:'Name or number of the person is missing'
    })
  }

  const newPerson = new Person({
    name:body.name,
    number:body.number
  })

  newPerson.save().then(savedPerson=>response.json(savedPerson))
})


app.delete('/api/persons/:id',(request,response)=>{
  const id=Number(request.params.id)
    persons=persons.filter(person=>person.id!==id)

    response.status(204).end()
})

app.get('/info',(request,response) =>{
    const message = `<div>Phonebook has info for ${persons.length} people</div>
                    <div>${new Date()}</div>`      

    response.send(message)
})

const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
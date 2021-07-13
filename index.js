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


app.get('/api/persons',(request,response) =>{
    Person.find({}).then(persons=>response.json(persons))
})

app.get('/api/persons/:id',(request,response,next) =>{
    const id=request.params.id
    Person.findById(id).then(person=>{person
                                      ?response.json(person)
                                      :response.status(404).json({error:'no person with the specified id found'})
                                      })
                       .catch(error=>next(error))
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
  const id=request.params.id
    Person.findByIdAndRemove(id)
          .then(person=>response.status(404).end())
          .catch(error=>console.log(error.message))
})

app.put('/api/persons/:id',(request,response)=>{
  const id=request.params.id
  const body=request.body
  console.log(body);
  Person.findByIdAndUpdate(id, body, { new:true })
        .then(updatedNote=>response.json(updatedNote))
        .catch(error=>next(error))

})

//Unknown endpoint error middleware
const unknownEndPoint = (request,response) =>{
  response.status(404).send({error:'Unknown endpoint '})
}

app.use(unknownEndPoint)

const errorHandler = (error,request,response,next) =>{
  console.log(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error:'malformed id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
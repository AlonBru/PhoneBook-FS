const express = require('express');
const app = express();
const port = process.env.PORT;
const morgan = require('morgan');
const Person = require('./models/person');

const cors = require('cors')

app.use(cors())

app.use(express.static('build'))

app.use(express.json())


morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))




function currentTime(){
    return  (new Date).toString()
}

app.get('/api/info',(req,res)=> {
    Person.find({}).then(persons=>{
        res.send(`
        <h1>PhoneBook</h1><br>
        <p>Phonebook has info for ${persons.length} entries</p>
        <p> ${currentTime()}</p>`)
    })
    .catch(e=>next(e))
})

app.get('/api/persons',(req,res,next)=> {
    Person.find({}).then(persons=>{
        res.json(persons.map(person=>person.toJSON()))
    })
    .catch(e=>next(e))
})
app.get('/api/persons/:id',(req,res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person){
            res.json(person)
        }else{
            res.status(404).end()
        }
    })
    .catch(err=>next(err))
})
app.post('/api/persons',(req,res) => {
    const body = req.body;
    
    const {name, number} = body
    if(!number||!name){
        return res.status(400).json({
            error:'content missing'
        })
    }
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(savedPerson=>{
        res.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        console.log(updatedPerson);  
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

app.delete('/api/persons/:id',(req,res,next)=> {
    const id = (req.params.id);
    Person.findByIdAndRemove(id)
    .then(result=>{
        res.status(204).end()
    }).catch(e=>next(e))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    next(error)
  }
  
  app.use(errorHandler)

const PORT = port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
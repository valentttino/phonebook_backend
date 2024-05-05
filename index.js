require('dotenv').config() // dotenv for enviroment variables
const express = require('express') // import express
const app = express()
const morgan = require('morgan') // import morgan for msgs in console
const cors = require('cors') // import cors
const Person = require('./models/person') // import person module


app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

const requestLogger = (request, response, next) =>{
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

app.get('/', (request, response) =>{
    response.send('<h1> Hello world.. </h1> <h2> This API was made by Valentino Boggio </h2> <p> In progress.. </p>')
})

let cont = 0

app.get('/api/persons', (request, response) =>{
    cont++
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) =>{ 
    const hora = new Date().toString()
    response.send(`Phonebook has info for ${cont} people <br/> <br/> ${hora}`)
})

app.get('/api/persons/:id', (request, response, next) =>{
    Person.findById(request.params.id)
        .then(person => {
            if (person){
                response.json(person)
            } else{
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) =>{
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// const findName = (name) =>{
//     const found = persons.find(person => person.name === name)

//     if(found){
//         return true
//     }else{
//         return false
//     }
// }

app.post('/api/persons', (request, response) =>{
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({error: 'content missing'})
    }

    // if(findName(body.name)){
    //     return response.status(409).json({
    //         error: 'Person already exists'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) =>{
    response.status(404).send({error:'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) =>{
    console.error(error.mnessage)

    if (error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
/**
 * CONFIGURATION
 */
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const morgan = require('morgan')
morgan.token('body', (request, response) => {
    const body = request.body
    if (body) {
        return JSON.stringify(body)
    } else {
        return null
    }
})

const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(
    morgan(':method :url :status :res[content-length] :response-time ms :body ')
)
app.use(express.static('build'))

/**
 * ROUTES
 */

app.get('/info', (request, response, next) => {
    return Person.find({})
        .then((persons) => {
            const date = new Date()
            response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`)
        })
        .catch((err) => next(err))
})

app.get('/api/persons', (request, response, next) => {
    return Person.find({})
        .then((persons) => {
            response.json(persons)
        })
        .catch((err) => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
        .then((person) => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch((err) => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndRemove(id)
        .then((result) => {
            console.log('🟢', result)
            response.status(204).end()
        })
        .catch((err) => next(err))
})

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({
            error: 'Could not create an entry. Missing name or number.',
        })
    }

    const person = new Person({
        name,
        number,
    })

    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson)
        })
        .catch((err) => next(err))
})

/**
 * ERROR HANDLING
 */

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

// handler of requests with result to errors
const errorHandler = (error, request, response, next) => {
    console.error('🔴', error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

/**
 * SERVER
 */

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

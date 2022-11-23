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

app.get('/info', (request, response) => {
    return Person.find({}).then((persons) => {
        const date = new Date()
        response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`)
    })
})

app.get('/api/persons', (request, response) => {
    return Person.find({}).then((persons) => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id)
        .then((person) => {
            response.json(person)
        })
        .catch((err) => {
            response.status(404).end()
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findByIdAndRemove(id)
        .then((result) => {
            console.log('🟢', result)
            response.status(204).end()
        })
        .catch((err) => {
            console.log('🔴', err)
            response.status(404).end()
        })
})

app.post('/api/persons', (request, response) => {
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
        .catch((err) => {
            console.log('🔴', err)
            response.status(500).end()
        })
})

/**
 * SERVER
 */

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

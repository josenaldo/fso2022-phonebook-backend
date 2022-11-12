const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('body', (request, response) => {
    const body = request.body
    if (body) {
        return JSON.stringify(body)
    } else {
        return null
    }
})
app.use(
    morgan(':method :url :status :res[content-length] :response-time ms :body ')
)

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
]

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find((n) => n.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find((n) => n.id === id)

    if (person) {
        persons = persons.filter((n) => n.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

const randomInt = () => {
    return Math.floor(Math.random() * Number.MAX_VALUE)
}

const generateId = () => {
    const existingIds = persons.map((p) => p.id)

    let newId = randomInt()

    while (existingIds.includes(newId)) {
        newId = randomInt()
    }

    return newId
}

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({
            error: 'Could not create an entry. Missing name or number.',
        })
    }

    const existingPerson = persons.find((p) => p.name === name)

    if (existingPerson) {
        return response.status(409).json({
            error: 'Could not createan entry. Name must be unique.',
        })
    }

    const person = {
        id: generateId(),
        name: name,
        number: number,
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

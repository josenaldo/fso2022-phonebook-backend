const express = require('express')
const app = express()

app.use(express.json())

let notes = [
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
    response.send(`<p>Phonebook has info for ${notes.length} people</p>
    <p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.send(notes)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const note = notes.find((n) => n.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const note = notes.find((n) => n.id === id)

    if (note) {
        notes = notes.filter((n) => n.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

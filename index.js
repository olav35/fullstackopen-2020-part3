const express = require('express')
const app = express()

let numbers = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/info', (_, response) => {
    response.send(`Phonebook has info for 4 people<br><br>${new Date}`)
})

app.get('/api/persons', (_, response) => {
    response.json(numbers)
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
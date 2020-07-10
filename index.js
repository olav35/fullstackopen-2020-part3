const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan((tokens, request, response) => 
    [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        JSON.stringify(request.body)
    ].join(' ')
))

app.get('/info', (_, response, next) => {
    Person.countDocuments({}, (error, count) => {
        if(error){
            console.log(error)
        } else {
            response.send(`Phonebook has info for ${count} persons<br><br>${new Date}`)
        }
    }).catch(error => next(error))
})

app.get('/api/persons', (error, _, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then((person) => {
            response.json(person)
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (error, request, response, next) => {
    const id = request.params.id
    Person.findByIdAndRemove(id)
        .then((_) => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons', (request, response, next) => {
    const person = new Person({
        name: request.body.name,
        number: request.body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => {
            next(error)
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number
    }

    const id = request.params.id
    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, _, response, next) => {
    console.error(error.message)

    switch (error.name) {
    case 'CastError':
        return response.status(400).send({ error: 'malformatted id'})    
    case 'ValidationError':
        return response.status(400).json({ error: error.message })
    default:
        next(error)
    }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan((tokens, request, response) => {return [tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        JSON.stringify(request.body)
    ].join(' ')
}))

app.get('/info', (_, response) => {
    Person.countDocuments({}, (error, count) => {
        if(error){
            console.log(error)
        } else {
            response.send(`Phonebook has info for ${count} persons<br><br>${new Date}`)
            const person = request.body
        }
    })
})

app.get('/api/persons', (_, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id)
        .then((person) => {
            response.json(person)
        })
        .catch(_ => {
            response.status(404).end()
        })

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndRemove(id)
        .then(_ => response.status(204).end())
})

app.post('/api/persons', (request, response) => {
    const person = new Person({
        name: request.body.name,
        number: request.body.number
    })

    if(!person.name) {
        response.status(400).json({ error: 'name missing' })
    } else if (!person.number){
        response.status(400).json({ error: 'number missing'})
    } else {
        person.save().then(savedPerson => {
            response.json(savedPerson)
        }) 
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

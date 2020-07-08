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
    const id = Number(request.params.id)
    Person = Person.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 2**31) // It said explicitly to do this.

    const person = request.body
    person.id = id

    if(!person.name) {
        response.status(400).json({ error: 'name missing' })
    } else if (!person.number){
        response.status(400).json({ error: 'number missing'})
    } else if (Person.some(p => p.name === person.name)){
        response.json({ error: 'name not unique' })
    } else {
        Person = Person.concat(person)

        response.status(200).json(person)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

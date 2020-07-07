const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://phonebook:${password}@cluster0.uupsv.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const viewEntries = () => {
    console.log('phonebook:')
    return Person
        .find({})
        .then(persons => persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        }))
}

const addEntry = (name, number) => {
    const person = new Person({
        name,
        number
    })

    return person.save().then(_ => {
        console.log(`added ${name} number ${number} to phonebook`)
    })
}
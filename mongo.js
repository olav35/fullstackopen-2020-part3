const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://phonebook:${password}@cluster0.uupsv.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

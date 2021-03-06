const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an aargument: node mongo.js <password>')
  process.exit(1)
}
const password = process.argv[2]

const url =
`mongodb+srv://AB_main:${password}@abcluster0.fzxuc.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3 ){
 Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })   
}else{

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(result => {
        console.log(`Added ${person.name} with number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
    
}
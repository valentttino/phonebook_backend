const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
  const password = process.argv[2]
  
  const url =
    `mongodb+srv://vgboggio:${password}@cluster0.6rfhfc8.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
  
  mongoose.set('strictQuery',false)
  
  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const Person = mongoose.model('Person', personSchema)

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  if (process.argv.length===3){
    console.log('phonebook:')

    Person.find({}).then(result =>{
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)

        })
        mongoose.connection.close()
    })
  }
  if (process.argv.length>3){
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
      })
  }
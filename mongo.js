const mongoose = require('mongoose')

const getUrl = () => {
    const password = encodeURIComponent(process.argv[2])
    const user = 'fullstack'
    const cluster = 'cluster0.f8cd8ok.mongodb.net'
    const database = 'phonebookApp'
    const url = `mongodb+srv://${user}:${password}@${cluster}/${database}?retryWrites=true&w=majority`

    return url
}

const Person = mongoose.model(
    'Person',
    new mongoose.Schema({
        name: String,
        number: Number,
    })
)

const find = () => {
    mongoose
        .connect(getUrl())
        .then((result) => {
            Person.find({ important: true })
                .then((result) => {
                    console.log('Phonebook:')
                    result.forEach((person) => {
                        console.log(`${person.name} ${person.number}`)
                    })
                })
                .catch((err) => {
                    console.log('🔴 | file: mongo.js | line 76 | Erro', err)
                })
                .finally(() => {
                    mongoose.connection.close()
                })
        })
        .catch((err) => {
            console.log('🔴 | file: mongo.js | line 83 | Erro', err)
        })
}

const create = (name, number) => {
    mongoose
        .connect(getUrl())
        .then((result) => {
            const person = {
                name,
                number,
            }

            Person.create(person)
                .then((result) => {
                    console.log(`Added ${name} number ${number} to phonebook`)
                })
                .catch((err) => {
                    console.log(
                        '🔴 | file: mongo.js | line 103 | Cannot save person',
                        err
                    )
                })
                .finally(() => {
                    return mongoose.connection.close()
                })
        })
        .catch((err) => {
            console.log(
                '🔴 | file: mongo.js | line 60 | Canoot connect to database',
                err
            )
        })
}

const main = () => {
    if (process.argv.length < 3) {
        console.log(
            'please provide the password as an argument: node mongo.js <password>'
        )

        process.exit(1)
    }

    if (process.argv.length === 3) {
        find()
    }

    if (process.argv.length === 4) {
        console.log(
            'Please provide the name and number as arguments: node mongo.js <password> <name> <number>'
        )
        process.exit(1)
    }

    if (process.argv.length === 5) {
        create(process.argv[3], process.argv[4])
    }

    if (process.argv.length > 5) {
        console.log('Too many arguments')
    }
}

main()

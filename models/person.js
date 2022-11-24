const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
    .connect(url)
    .then((result) => {
        console.log('connected to MongoDB')
    })
    .catch((err) => {
        console.log('error connecting to MongoDB:', err.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'Name must be at least 3 characters long'],
    },
    number: {
        type: String,
        required: true,
        minlength: [9, 'Number must be at least 8 characters long'],
        validate: {
            validator: (v) => {
                return /^(\d{2,3})-(\d{5,})/.test(v)
            },
            message: (props) =>
                `${props.value} is not a valid phone number! The number must have 2 parts. The first part must be 2-3 digits long and the second part must be 5 or more digits long. The parts must be separated by a hyphen.`,
        },
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person

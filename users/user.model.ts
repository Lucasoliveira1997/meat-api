import * as mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String,  unique: true},
    password: {type: String, select: false}
})

export const User = mongoose.model('User', userSchema)
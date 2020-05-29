import * as mongoose from 'mongoose'
import {validateCPF} from '../common/validators'
import {environment} from '../common/environment'
import * as bcrypt from 'bcrypt'

export interface User extends mongoose.Document {
    name: string, 
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, maxlength: 80, minlength: 3},
    email: {
        type: String,  
        unique: true, 
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {type: String, required: true},
    gender: {type: String, required: false, enum: ['male', 'female']},
    cpf: {
        type: String, 
        required: true, 
        unique: true,
        validate: 
            {
                validator: validateCPF,
                message: '{PATH} Invalid CPF ({VALUE})'
            },            
        }
})

const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds)
    .then(hash => {
        obj.password = hash
        return next()
    }).catch(next)
}

const saveMiddleware = function(next) {
    const user: User = this

    if(!user.isModified('password')){
        return next()
    } else {
        hashPassword(user, next)
    }
}

const updateMiddleware = function(next) {

    if(!this.getUpdate().password) {
        return next()
    } else {
        hashPassword(this.getUpdate(), next)
    }    
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)

export const User = mongoose.model<User>('User', userSchema)
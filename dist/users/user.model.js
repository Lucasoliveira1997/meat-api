"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const validators_1 = require("../common/validators");
const environment_1 = require("../common/environment");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 80, minlength: 3 },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: { type: String, required: true, select: false },
    gender: { type: String, required: false, enum: ['male', 'female'] },
    cpf: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validators_1.validateCPF,
            message: '{PATH} Invalid CPF ({VALUE})'
        },
    },
    profiles: {
        type: [String],
        required: false
    }
});
userSchema.statics.findByEmail = function (email, projection) {
    return this.findOne({ email }, projection);
};
userSchema.methods.matches = function (password) {
    return bcrypt.compareSync(password, this.password);
};
userSchema.methods.hasAny = function (...profiles) {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1);
};
const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment_1.environment.security.saltRounds)
        .then(hash => {
        obj.password = hash;
        return next();
    }).catch(next);
};
const saveMiddleware = function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    else {
        hashPassword(user, next);
    }
};
const updateMiddleware = function (next) {
    if (!this.getUpdate().password) {
        return next();
    }
    else {
        hashPassword(this.getUpdate(), next);
    }
};
userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);
exports.User = mongoose.model('User', userSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors = require("restify-errors");
const jwt = require("jsonwebtoken");
const user_model_1 = require("../users/user.model");
const environment_1 = require("../common/environment");
exports.authenticate = (req, resp, next) => {
    if (!req.body) {
        return next(new errors.InvalidContentError('Expected credentials to authenticate'));
    }
    const { email, password } = req.body;
    user_model_1.User.findByEmail(email, '+password')
        .then(user => {
        if (user && user.matches(password)) {
            const token = jwt.sign({ sub: user.email, iss: 'meat-api' }, environment_1.environment.security.apiSecret);
            resp.json({
                name: user.name,
                email: user.email,
                accessToken: token
            });
            return next();
        }
        else {
            return next(new errors.NotAuthorizedError('Invalid Credentials'));
        }
    }).catch(next);
};

import * as restify from 'restify'
import * as errors from 'restify-errors'
import * as jwt from 'jsonwebtoken'

import { User } from '../users/user.model'
import { environment } from '../common/environment'

export const authenticate: restify.RequestHandler = (req, resp, next) => {

    if(!req.body) {
        return next(new errors.InvalidContentError('Expected credentials to authenticate'))
    }

    const { email, password } = req.body

    User.findByEmail(email, '+password')
        .then(user => {          
            if (user && user.matches(password)) {
                const token = jwt.sign({sub: user.email, iss: 'meat-api'}, environment.security.apiSecret)

                resp.json({
                    name: user.name,
                    email: user.email,
                    accessToken: token
                })

                return next()
            } else {
                return next(new errors.NotAuthorizedError('Invalid Credentials'))
            }
        }).catch(next)
}
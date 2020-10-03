import { ModelRouter } from '../common/model.router'
import * as restify from 'restify'
import { User } from './user.model'
import { authenticate } from '../security/auth.handler'
import { authorize } from '../security/authz.handler'

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
            //delete document.password
        })
    }

    findByEmail = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        if(req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => user ? [user] : [])
                .then(this.renderAll(resp, next))
                .catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server) {
        application.get({path: `${this.basePath}`, version: '2.0.0'}, /*[authorize('admin'),*/ this.findByEmail, this.findAll/*]*/)

        application.get({path: `${this.basePath}`, version: '1.0.0'}, /*[authorize('admin'),*/ this.findAll/*]*/)

        application.get(`${this.basePath}/:id`, /*[authorize('admin'),*/ this.validateId, this.findById/*]*/)

        application.post(`${this.basePath}`, /*[authorize('admin'),*/ this.save/*]*/)

        application.put(`${this.basePath}/:id`, /*[authorize('admin'),*/ this.validateId, this.replace/*]*/)

        application.patch(`${this.basePath}/:id`, /*[authorize('admin'),*/ this.validateId, this.update/*]*/)

        application.del(`${this.basePath}/:id`, /*[authorize('admin'),*/ this.validateId, this.delete/*]*/)

        application.post(`${this.basePath}/auth`, authenticate)
    }
}

export const usersRouter = new UsersRouter()
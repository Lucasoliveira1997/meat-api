import { ModelRouter } from '../common/model.router'
import { Restaurant } from './restaurant.model'
import * as restify from 'restify'
import {NotFoundError} from 'restify-errors'

class RestaurantsRouter extends ModelRouter<Restaurant> {
    constructor() {
        super(Restaurant)
    }

    findMenu = (req, resp, next) => {
        this.model.findById(req.params.id, '+menu')
            .then(rest => {
                if(rest) {
                    resp.json(rest.menu)
                } else {
                    next(new NotFoundError('Restaurant Not Found'))
                }
            }).catch(next)
    }

    replaceMenu = (req, resp, next) => {
        this.model.findById(req.params.id)
            .then(rest => {
                if(rest) {
                    rest.menu = req.body
                    return rest.save()
                } else {
                    next(new NotFoundError('Restaurant Not Found'))
                }
            }).then(rest => {
                resp.json(rest.menu)
            }).catch(next)
    }

    applyRoutes(application: restify.Server) {
        application.get('/restaurants', this.findAll)
        application.get('/restaurants/:id', [this.validateId, this.findById])
        application.post('/restaurants', this.save)
        application.put('/restaurants/:id', [this.validateId, this.replace])
        application.patch('/restaurants/:id', [this.validateId, this.update])
        application.del('/restaurants/:id', [this.validateId, this.delete])

        //specific to menu url's
        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu])
        application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu])
    }
}

export const restaurantsRouter = new RestaurantsRouter()
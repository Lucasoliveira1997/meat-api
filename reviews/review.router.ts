import * as restify from 'restify'
import * as mongoose from 'mongoose'

import { ModelRouter } from '../common/model.router'
import { Review } from './review.model'

import { authorize } from '../security/authz.handler'

class ReviewsRouter extends ModelRouter<Review> {
    constructor() {
        super(Review)
    }

    envelope(document) {
        let resource = super.envelope(document)
        let restaurantId = document.restaurant._id ? document.restaurant._id : document.restaurant
        resource._links.restaurant = `/restaurants/${restaurantId}`
        return resource
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('user', 'name')
                    .populate('restaurant', 'name')
    }

    applyRoutes(application: restify.Server) {

        application.post(`${this.basePath}`, [authorize('user'), this.save])
        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete])      
    }
}

export const reviewsRouter = new ReviewsRouter()
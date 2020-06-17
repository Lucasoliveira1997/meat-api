import * as restify from 'restify'
import * as mongoose from 'mongoose'

import { ModelRouter } from '../common/model.router'
import { Review } from './review.model'

class ReviewsRouter extends ModelRouter<Review> {
    constructor() {
        super(Review)
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('user', 'name')
                    .populate('restaurant', 'name')
    }

    applyRoutes(application: restify.Server) {

        application.post('//reviews', this.save)
        application.get('/reviews', this.findAll)
        application.get('/reviews/:id', [this.validateId, this.findById])
        application.del('/reviews', [this.validateId, this.delete])
        
    }
}

export const reviewsRouter = new ReviewsRouter()
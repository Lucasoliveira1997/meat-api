"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model.router");
const review_model_1 = require("./review.model");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(review_model_1.Review);
    }
    envelope(document) {
        let resource = super.envelope(document);
        let restaurantId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        resource._links.restaurant = `/restaurants/${restaurantId}`;
        return resource;
    }
    prepareOne(query) {
        return query.populate('user', 'name')
            .populate('restaurant', 'name');
    }
    applyRoutes(application) {
        application.post(`${this.basePath}`, this.save);
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
    }
}
exports.reviewsRouter = new ReviewsRouter();

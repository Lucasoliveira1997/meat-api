"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model.router");
const restaurant_model_1 = require("./restaurant.model");
const restify_errors_1 = require("restify-errors");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurant_model_1.Restaurant);
        this.findMenu = (req, resp, next) => {
            this.model.findById(req.params.id, '+menu')
                .then(rest => {
                if (rest) {
                    resp.json(rest.menu);
                }
                else {
                    next(new restify_errors_1.NotFoundError('Restaurant Not Found'));
                }
            }).catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            this.model.findById(req.params.id)
                .then(rest => {
                if (rest) {
                    rest.menu = req.body;
                    return rest.save();
                }
                else {
                    next(new restify_errors_1.NotFoundError('Restaurant Not Found'));
                }
            }).then(rest => {
                resp.json(rest.menu);
            }).catch(next);
        };
    }
    applyRoutes(application) {
        application.get('/restaurants', this.findAll);
        application.get('/restaurants/:id', [this.validateId, this.findById]);
        application.post('/restaurants', this.save);
        application.put('/restaurants/:id', [this.validateId, this.replace]);
        application.patch('/restaurants/:id', [this.validateId, this.update]);
        application.del('/restaurants/:id', [this.validateId, this.delete]);
        //specific to menu url's
        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
        application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();

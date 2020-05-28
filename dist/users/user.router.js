"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const user_model_1 = require("./user.model");
const restify_errors_1 = require("restify-errors");
class UsersRouter extends router_1.Router {
    constructor() {
        super();
        this.on('beforeRender', document => {
            document.password = undefined;
            //delete document.password
        });
    }
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => {
            user_model_1.User.find()
                .then(this.render(resp, next))
                .catch(next);
        });
        application.get('/users/:id', (req, resp, next) => {
            user_model_1.User.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next);
        });
        application.post('/users', (req, resp, next) => {
            let user = new user_model_1.User(req.body);
            user.save()
                .then(this.render(resp, next))
                .catch(next);
        });
        application.put('/users/:id', (req, resp, next) => {
            const options = { overwrite: true };
            user_model_1.User.update({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                if (result) {
                    user_model_1.User.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Document not found');
                }
            }).then(this.render(resp, next))
                .catch(next);
        });
        application.patch('/users/:id', (req, resp, next) => {
            const options = { new: true };
            user_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        });
        application.del('/users/:id', (req, resp, next) => {
            user_model_1.User.remove({ _id: req.params.id })
                .exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Document not found');
                }
                return next();
            }).catch(next);
        });
    }
}
exports.usersRouter = new UsersRouter();

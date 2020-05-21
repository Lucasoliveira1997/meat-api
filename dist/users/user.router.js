"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const user_model_1 = require("./user.model");
class UsersRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => {
            user_model_1.User.find()
                .then(users => {
                resp.json(users);
                return next();
            });
        });
        application.get('/users/:id', (req, resp, next) => {
            user_model_1.User.findById(req.params.id)
                .then(user => {
                if (user) {
                    resp.json(user);
                    return next;
                }
                else {
                    resp.status(404);
                    resp.send('This user not exists');
                    return next();
                }
            });
        });
        application.post('/users', (req, resp, next) => {
            let user = new user_model_1.User(req.body);
            user.save()
                .then(user => {
                user.password = undefined;
                resp.json(user);
                return next();
            });
        });
        application.put('/users/:id', (req, resp, next) => {
            const options = { overwrite: true };
            user_model_1.User.update({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                if (result) {
                    user_model_1.User.findById(req.params.id);
                }
                else {
                    resp.send(404);
                }
            }).then(user => {
                resp.json(user);
                return next();
            });
        });
        application.patch('/users/:id', (req, resp, next) => {
            const options = { new: true };
            user_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(user => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                else {
                    resp.send(404);
                    return next();
                }
            });
        });
    }
}
exports.usersRouter = new UsersRouter();

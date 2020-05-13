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
    }
}
exports.usersRouter = new UsersRouter();

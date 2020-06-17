"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model.router");
const user_model_1 = require("./user.model");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(user_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                user_model_1.User.find({ email: req.query.email })
                    .then(this.renderAll(resp, next))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
            //delete document.password
        });
    }
    applyRoutes(application) {
        application.get({ path: '/users', version: '2.0.0' }, [this.findByEmail, this.findAll]);
        application.get({ path: '/users', version: '1.0.0' }, this.findAll);
        application.get('/users/:id', [this.validateId, this.findById]);
        application.post('/users', this.save);
        application.put('/users/:id', [this.validateId, this.replace]);
        application.patch('/users/:id', [this.validateId, this.update]);
        application.del('/users/:id', [this.validateId, this.delete]);
    }
}
exports.usersRouter = new UsersRouter();

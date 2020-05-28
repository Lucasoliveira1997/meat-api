"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const error_handler_1 = require("./error.handler");
class Server {
    initializeDb() {
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', () => console.log('Database is connected'));
        mongoose.connection.on('disconnected', () => console.log('Database is disconnected'));
        mongoose.connection.on('error', () => console.log('Database is on Error'));
        return mongoose.connect(environment_1.environment.db.url, environment_1.environment.db.options);
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                // this.application.use(mergePatchBodyParser)
                //routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                //errors
                this.application.on('restifyError', error_handler_1.handleError);
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => {
            return this.initRoutes(routers).then(() => this);
        });
    }
}
exports.Server = Server;

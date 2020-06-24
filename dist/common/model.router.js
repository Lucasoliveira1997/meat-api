"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.validateId = (req, resp, next) => {
            if (mongoose.Types.ObjectId.isValid(req.params.id)) {
                next();
            }
            else {
                next(new restify_errors_1.NotFoundError('Document Not Found'));
            }
        };
        this.findAll = (req, resp, next) => {
            this.model.find()
                .then(this.renderAll(resp, next))
                .catch(next);
        };
        this.findById = (req, resp, next) => {
            this.prepareOne(this.model.findById(req.params.id))
                .then(this.render(resp, next))
                .catch(next);
        };
        this.save = (req, resp, next) => {
            let document = new this.model(req.body);
            document.save()
                .then(this.render(resp, next))
                .catch(next);
        };
        this.replace = (req, resp, next) => {
            const options = { overwrite: true, runValidators: true };
            this.model.update({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                if (result) {
                    this.model.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Document not found');
                }
            }).then(this.render(resp, next))
                .catch(next);
        };
        this.update = (req, resp, next) => {
            const options = { new: true, runValidators: true };
            this.model.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.delete = (req, resp, next) => {
            this.model.remove({ _id: req.params.id })
                .exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Document not found');
                }
                return next();
            }).catch(next);
        };
        this.basePath = `/${model.collection.name}`;
    }
    prepareOne(query) {
        return query;
    }
    envelope(document) {
        let resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }
}
exports.ModelRouter = ModelRouter;

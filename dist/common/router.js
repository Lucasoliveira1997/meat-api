"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
    envelope(document) {
        return document;
    }
    render(resp, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                resp.json(this.envelope(document));
            }
            else {
                throw new restify_errors_1.NotFoundError('Document not found');
            }
            return next();
        };
    }
    renderAll(resp, next) {
        return (documents) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });
                resp.json(documents);
            }
            else {
                resp.json([]);
            }
            return next();
        };
    }
}
exports.Router = Router;

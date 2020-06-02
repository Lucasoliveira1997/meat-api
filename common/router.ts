import * as restify from 'restify'
import {EventEmitter} from 'events'
import {NotFoundError} from 'restify-errors'

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server)

    render(resp: restify.Response, next: restify.Next) {
        return (document) => {
            if(document) {
                this.emit('beforeRender', document)
                resp.json(document)
            } else {
                throw new NotFoundError('Document not found')
            }
            return next()
        }
    }

    renderAll(resp: restify.Response, next: restify.Next) {
        return (documents: any[]) => {
            if(documents) {
                documents.forEach(document => {
                    this.emit('beforeRender', document)
                })
            resp.json(documents)
            } else {
                resp.json([])
            }
        }
    }
}
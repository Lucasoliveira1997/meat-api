import {Router} from './router'
import * as mongoose from 'mongoose'
import {NotFoundError} from 'restify-errors'

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    constructor(protected model: mongoose.Model<D>) {
        super()
    }

    protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
        return query
    }

    validateId = (req, resp, next) => {
        if(mongoose.Types.ObjectId.isValid(req.params.id)) {
            next()
        } else {
            next(new NotFoundError('Document Not Found'))
        }
    }

    findAll = (req, resp, next) => {
        this.model.find()
            .then(this.renderAll(resp, next))
            .catch(next)
    }

    findById = (req, resp, next) => {
        this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(resp, next))
            .catch(next)
    }

    save = (req, resp, next) => {
        let document = new this.model(req.body)
        document.save()
            .then(this.render(resp, next))
            .catch(next)
    }

    replace = (req, resp, next) => {
        const options = { overwrite: true, runValidators: true }
        this.model.update({ _id: req.params.id }, req.body, options)
            .exec().then(result => {
                if (result) {
                    this.model.findById(req.params.id)
                } else {
                    throw new NotFoundError('Document not found')
                }
            }).then(this.render(resp, next))
              .catch(next)
    }

    update = (req, resp, next) => {
        const options = { new: true, runValidators: true }
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next)
    }

    delete = (req, resp, next) => {
        this.model.remove({ _id: req.params.id })
            .exec().then((cmdResult: any) => {
                if (cmdResult.result.n) {
                    resp.send(204)
                } else {
                    throw new NotFoundError('Document not found')
                }
                return next()
            }).catch(next)
    }
}
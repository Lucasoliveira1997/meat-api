import * as restify from 'restify'
import * as mongoose from 'mongoose'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import {mergePatchBodyParser} from './merge-patch.parser'
import {handleError} from './error.handler'
export class Server {

    application: restify.Server

    initializeDb(): mongoose.MongooseThenable{
        (<any>mongoose).Promise = global.Promise
        mongoose.connection.on('connected', () => console.log('Database is connected'))
        mongoose.connection.on('disconnected', () => console.log('Database is disconnected'))
        mongoose.connection.on('error', () => console.log('Database is on Error'))
        return mongoose.connect(environment.db.url, environment.db.options)
    }

    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })

                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                // this.application.use(mergePatchBodyParser)

                //routes
                for(let router of routers) {
                    router.applyRoutes(this.application)
                }

                //errors
                this.application.on('restifyError', handleError)

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })
            } catch (error) {
                reject(error)
            }
        })
    }
    
    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDb().then(() => {
            return this.initRoutes(routers).then(() => this)
        })
               
    }
}
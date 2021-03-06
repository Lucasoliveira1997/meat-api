import { Server } from './server/server'

//routes
import { usersRouter } from './users/user.router'
import { restaurantsRouter } from './restaurants/restaurant.router'
import { reviewsRouter } from './reviews/review.router'

const server = new Server

server.bootstrap([
        usersRouter,
        restaurantsRouter,
        reviewsRouter
    ])
    .then(server => console.log('Server is listening on:', server.application.address()))
    .catch(error => {
        console.log('Server failed to start!')        
        console.error(error)
        process.exit(1)
    })
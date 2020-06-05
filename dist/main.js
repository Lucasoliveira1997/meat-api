"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
//routes
const user_router_1 = require("./users/user.router");
const restaurant_router_1 = require("./restaurants/restaurant.router");
const review_router_1 = require("./reviews/review.router");
const server = new server_1.Server;
server.bootstrap([
    user_router_1.usersRouter,
    restaurant_router_1.restaurantsRouter,
    review_router_1.reviewsRouter
])
    .then(server => console.log('Server is listening on:', server.application.address()))
    .catch(error => {
    console.log('Server failed to start!');
    console.error(error);
    process.exit(1);
});

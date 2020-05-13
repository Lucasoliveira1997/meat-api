"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    server: {
        port: process.env.SERVER_PORT || 3003
    },
    db: {
        url: process.env.DB_URL || 'mongodb://localhost/meat-api',
        options: {
            useMongoClient: true
        }
    }
};

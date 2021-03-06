export const environment = {
    server: {
        port: process.env.SERVER_PORT || 3003
    },
    db: {
        url: process.env.DB_URL || 'mongodb://localhost/meat-api',
        options: {
            useMongoClient: true
        }
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || 'meat-api-secret'
    },
    log: {
        name: 'meat-api-loogger',
        level: process.env.LOG_LEVEL || 'debug'
    }
}
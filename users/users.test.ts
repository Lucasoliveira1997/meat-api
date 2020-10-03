import 'jest'
import * as request from 'supertest'

import { Server } from '../server/server'
import { environment } from '../common/environment'
import { User } from './user.model'
import { usersRouter } from './user.router'

let address: string
let server: Server

beforeAll(() => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test',
    environment.server.port = process.env.PORT || 3001,
    address = `http://localhost:${environment.server.port}`,
    server = new Server
    return server.bootstrap([usersRouter])
                 .then(() => User.remove({}).exec())
                 .catch(console.error)
})

test('GET /users', () => {
    return request(address).get('/users')
        .then(resp => {
            console.log(resp.body)
            expect(resp.status).toBe(200)
            expect(resp.body.items).toBeInstanceOf(Array)
        }).catch(fail)        
})

test('POST /users', () => {
    return request(address).post('/users')
        .send({
            name: "Arnold",
            email: "arnold@gmail.com",
            password: "123",
            cpf: "94946600051",
            gender: "male"
        })
        .then(resp => {
            expect(resp.status).toBe(200)
            expect(resp.body._id).toBeDefined()
            expect(resp.body.name).toBe('Arnold')
            expect(resp.body.email).toBe('arnold@gmail.com')
            expect(resp.body.cpf).toBe('94946600051')
            expect(resp.body.password).toBeUndefined()
        })
        .catch(fail)
})

afterAll(() => {
    return server.shutdown()
})
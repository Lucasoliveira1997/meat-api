import * as mongoose from 'mongoose'

import { Restaurant } from '../restaurants/restaurant.model'
import { User } from '../users/user.model'

const objectId = mongoose.Schema.Types.ObjectId

export interface Review extends mongoose.Document {
    date: Date,
    raiting: number,
    comments: string,
    restaurant: mongoose.Types.ObjectId | Restaurant,
    user: mongoose.Types.ObjectId | User
}

const reviewSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now(), required: false},
    raiting: {type: Number, required: true},
    comments: {type: String, required: true, maxlength: 500},
    restaurant: {type: objectId, ref:'Restaurant', required: true},
    user: {type: objectId, ref: 'User', required: true}
})

export const Review = mongoose.model<Review>('Review', reviewSchema)
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;
const reviewSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now(), required: false },
    raiting: { type: Number, required: true },
    comments: { type: String, required: true, maxlength: 500 },
    restaurant: { type: objectId, ref: 'Restaurant', required: true },
    user: { type: objectId, ref: 'User', required: true }
});
exports.Review = mongoose.model('Review', reviewSchema);

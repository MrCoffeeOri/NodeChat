import { Schema, model } from "mongoose"

export const Dm = model("Dms", new Schema({
    name: String,
    block: Object,
    users: { type: Array, default: [] },
    messages: { type: Array, default: [] }
}, { timestamps: true }))
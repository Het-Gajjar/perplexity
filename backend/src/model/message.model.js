import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ["user", "ai"],
        required: true,
    }
})
const MessageModel = mongoose.model("message", messageSchema)

export default MessageModel;
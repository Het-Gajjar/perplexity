import mongoose from "mongoose";

const chatSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
    title: {
        type: String,
        trim: true,
        default: "New Chat",
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    }
})

const ChatModel=mongoose.model("chat",chatSchema)

export default ChatModel;
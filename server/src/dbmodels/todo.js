const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    completed:{
        type: Boolean,
        required: true,
        default: false,
    }
});

module.exports = mongoose.model("Todo", todoSchema);
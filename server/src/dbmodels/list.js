const mongoose = require("mongoose");
const todoSchema = require("./todo.js");

const listSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    tasks: [todoSchema],
});

module.exports = mongoose.model("List", listSchema);
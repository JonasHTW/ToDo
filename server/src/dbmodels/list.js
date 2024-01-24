const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("list", listSchema);
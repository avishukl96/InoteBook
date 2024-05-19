const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    //required: true, // Ensuring a user is always associated with the note
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "general",
  },
  timestamp: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("notes", NotesSchema);

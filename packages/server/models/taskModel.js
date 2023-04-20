const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },

  issue: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  submitted: {
    type: Date,
    default: Date.Now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);

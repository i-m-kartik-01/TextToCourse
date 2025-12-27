const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

moduleSchema.index({ courseId: 1, order: 1 });

module.exports = mongoose.model("Module", moduleSchema);
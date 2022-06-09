const { Schema, model } = require("mongoose");

const coverLetterSchema = new Schema(
  {
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CoverLetter = model("CoverLetter", coverLetterSchema);

module.exports = CoverLetter;

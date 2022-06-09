const { Schema, model } = require("mongoose");

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    workExperience: {
      type: String,
      required: true,
    },
    coverLetter: [{ type: Schema.Types.ObjectId, ref: "CoverLetter" }],
  },
  {
    timestamps: true,
  }
);

const Job = model("Job", jobSchema);

module.exports = Job;

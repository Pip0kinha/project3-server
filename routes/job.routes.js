const router = require("express").Router();
const Job = require("../models/Job.model");
const User = require("../models/User.model");

// start handling route below:

router.post("/job", (req, res, next) => {
  const { title, description, user } = req.body;

  Job.create({ title, description, coverLetter: [] })
    .then((newJob) => {
      return User.findByIdAndUpdate(
        user,
        { $push: { jobList: newJob._id } },
        { new: true }
      );
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.put("/job/:id", (req, res, next) => {
  const { title, description } = req.body;
  const { jobId } = req.params;
  Job.findByIdAndUpdate(jobId, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.delete("/job/:id", (req, res, next) => {
  const { jobId } = req.params;
  Job.findByIdAndRemove(jobId)
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

module.exports = router;

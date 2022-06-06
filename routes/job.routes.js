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

router.post("/new-job/:id/form", (req, res, next) => {
  const { id } = req.params;
  const { workExperience } = req.body;

  return Job.create({
    title: "starting title",
    description: "starting description",
    workExperience: workExperience,
    coverLetter: [],
  })
    .then((newJob) => {
      return User.findByIdAndUpdate(
        id,
        { $push: { jobList: newJob._id } },
        { new: true }
      );
    })
    .then((response) => res.json(response.data))
    .catch((err) => res.json(err));
});

router.put("/new-job/:id/form2", async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;
  console.log(req.body);
  const jobID = await User.findById(id)
    .then((user) => user.jobList[user.jobList.length - 1])
    .catch((err) => console.log(err));
  console.log(jobID);

  return await Job.findByIdAndUpdate(
    jobID,
    { title: title, description: description },
    { new: true }
  )
    .then((response) => console.log(response))
    .catch((err) => res.json(err));
});

module.exports = router;

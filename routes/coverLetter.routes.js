const axios = require("axios");
const router = require("express").Router();
const Job = require("../models/Job.model");
const CoverLetter = require("../models/CoverLetter.model");

//

router.get("/job/:coverLetterId/cover-letter", async (req, res, next) => {

  const {coverLetterId} = req.params

  CoverLetter.findById(coverLetterId)
  .then((response) => res.json(response))
  .catch((err) => res.json(err));

});
  

router.get("/job/:coverLetterId/cover-letter/edit", async (req, res, next) => {

  const {coverLetterId} = req.params

  CoverLetter.findById(coverLetterId)
  .then((response) => res.json(response))
  .catch((err) => res.json(err));

});

router.put("/job/:coverLetterId/cover-letter/edit", async (req, res, next) => {

  const {coverLetterId} = req.params
  const {text} =  req.body;

  CoverLetter.findByIdAndUpdate(coverLetterId, {text:text}, {new: true})
  .then((response) => res.json(response))
  .catch((err) => res.json(err));

});

router.delete("/job/:coverLetterId/cover-letter/delete", (req,res, next) => {
  const {coverLetterId} = req.params

  CoverLetter.findByIdAndRemove(coverLetterId)
  .then((response) => res.json(response))
  .catch((err) => res.json(err));
});

module.exports = router;

const router = require("express").Router();
const User = require("../models/User.model");
const Job = require("../models/Job.model");

/*  */
/* router.post("/user", (req, res, next) => {
  const { email, password } = req.body;
  User.create({ email, password, address: "", jobList: [] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
}); */

// this is the user "landing page" with the information he/she can modify and the list of Jobs he/she already created on the website:
router.get("/user-profile", (req, res, next) => {
  const { _id } = req.payload;
  console.log(req.payload);
  User.findById(_id)
    .populate("jobList")
    .then((user) => {
      console.log(user);
      res.json(user);
    })
    .catch((err) => res.json(err));
});

// the below route is on the user profile when he/she edits it to then create the cover letter (in the CL flow)
router.put("/user-profile/:id", (req, res, next) => {
  const { id } = req.params;

  User.findByIdAndUpdate(id, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.put("/new-user/:id/form", (req, res, next) => {
  const { id } = req.params;
  const { name, surname } = req.body;

  User.findByIdAndUpdate(id, { name: name, surname: surname }, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

module.exports = router;

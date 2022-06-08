const router = require("express").Router();
const Job = require("../models/Job.model");
const User = require("../models/User.model");
const CoverLetter = require("../models/CoverLetter.model");
const axios = require("axios");

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

router.post("/new-job/form", async (req, res, next) => {
  const { _id } = req.payload;
  const { workExperience } = req.body;

  try {
    const createdJob = await Job.create({
      title: "starting title",
      description: "starting description",
      workExperience: workExperience,
      coverLetter: [],
    });
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $push: { jobList: createdJob._id } },
      { new: true }
    );
    return res.json(createdJob);
  } catch {
    (err) => res.json(err);
  }

  /* return Job.create({
    title: "starting title",
    description: "starting description",
    workExperience: workExperience,
    coverLetter: [],
  })
    .then((newJob) => {
      console.log(newJob);
      createdJob = newJob;
      return User.findByIdAndUpdate(
        id,
        { $push: { jobList: newJob._id } },
        { new: true }
      );
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err)); */
});

router.put("/new-job/form2", async (req, res, next) => {
  const { _id } = req.payload;
  const { title, description, jobId, name, surname } = req.body;

  try {
    console.log("hello from the try block");
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { title: title, description: description },
      { new: true }
    );

    console.log(updatedJob);

    // here we create the prompt for our external API call:
    let prompt = `
      Applicant name: ${name} ${surname}\n
      Work Experience: ${updatedJob.workExperience}\n
      Job Title: ${updatedJob.title}\n
      Job Description: ${updatedJob.description}\n
      
      Write a cover letter for the above job opening. The cover letter should start with a salutation to the recruiter, and include the applicant's name and work experience:
      `;
    let body = {
      prompt: prompt,
      max_tokens: 2000,
      temperature: 0,
    };

    console.log(body);

    // here we make the call:
    let opeanAiResponse = await axios.post(
      `https://api.openai.com/v1/engines/text-davinci-002/completions`,
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_BEARER_TOKEN}`,
        },
      }
    );
    console.log("hellor from the API side");
    //console.log(opeanAiResponse);

    let coverLetterText = opeanAiResponse.data.choices[0].text; // if the response.choices.text os not a String, needs to convert to string

    let newCoverLetter = await CoverLetter.create({ text: coverLetterText });
    console.log(newCoverLetter);

    let jobWithCoverLetter = await Job.findByIdAndUpdate(
      jobId,
      { $push: { coverLetter: newCoverLetter._id } },
      { new: true }
    );
    return res.json(newCoverLetter);
  } catch {
    (err) => res.json(err);
  }
});

router.post("/user-profile/form", async (req, res, next) => {
  const { _id } = req.payload;
  const { workExperience, title, description } = req.body;

  try {
    const createdJob = await Job.create({
      title: title,
      description: description,
      workExperience: workExperience,
      coverLetter: [],
    });
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $push: { jobList: createdJob._id } },
      { new: true }
    );

    let prompt = `
    Applicant name: ${updatedUser.name} ${updatedUser.surname}\n
    Work Experience: ${createdJob.workExperience}\n
    Job Title: ${createdJob.title}\n
    Job Description: ${createdJob.description}\n
    
    Write a cover letter for the above job opening. The cover letter should start with a salutation to the recruiter, and include the applicant's name and work experience:
    `;
    let body = {
      prompt: prompt,
      max_tokens: 2000,
      temperature: 0,
    };
    // here we make the call:
    let opeanAiResponse = await axios.post(
      `https://api.openai.com/v1/engines/text-davinci-002/completions`,
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_BEARER_TOKEN}`,
        },
      }
    );

    let coverLetterText = opeanAiResponse.data.choices[0].text; // if the response.choices.text os not a String, needs to convert to string

    let newCoverLetter = await CoverLetter.create({ text: coverLetterText });
    console.log(newCoverLetter);

    let jobWithCoverLetter = await Job.findByIdAndUpdate(
      createdJob._id,
      { $push: { coverLetter: newCoverLetter._id } },
      { new: true }
    );
    return res.json(newCoverLetter);
  } catch {
    (err) => res.json(err);
  }
});

module.exports = router;

const express = require("express");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

const router = express.Router();

//Route: 1 => Fetch all Notes using : GET "api/notes/fetchallnotes/".  login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log("error:" + error);
    res.status(500).send("Some error occured");
  }
});

//Route: 2 => Add a new note using : GET "api/notes/addnote/".  login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid Name").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 charectors").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ erros: errors.array() });
      }
      console.log(req.user);
      const note = new Notes({ title, description, tag, user: req.user.id });

      console.log(note);

      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.log("error:" + error);
      res.status(500).send("Some error occured");
    }
  }
);

//Route: 3 => Update an existing note using : GET "api/notes/updatenote/".  login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.send(404).send("Not Found");
    }

    //check if same user
    if (note.user.toString() !== req.user.id) {
      res.send(401).send("Not Allowed");
    }

    //Update Query
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    //send response
    res.send(note);
  } catch (error) {
    console.log("error:" + error);
    res.status(500).send("Some error occured");
  }
});

module.exports = router;

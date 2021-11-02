const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
  console.log("Getting all users...");
  if (req.headers.secret != process.env.SECRET) {
    return res.status(401).json("You shall not pass... without password");
  }
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/FindUser").get((req, res) => {
  if (req.headers.secret != process.env.SECRET) {
    return res.status(401).json("You shall not pass... without password");
  }
  const email = req.headers.email;
  User.find({ email: email })
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/FindUser").delete((req, res) => {
  if (req.headers.secret != process.env.SECRET) {
    return res.status(401).json("You shall not pass... without password");
  }
  const email = req.headers.email;
  User.findOneAndDelete({ email: email })
    .then(() => res.status(200).json("User deleted."))
    .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/User").post((req, res) => {
  console.log("Creating new user...");
  if (req.headers.secret != process.env.SECRET) {
    return res.status(401).json("You shall not pass... without password");
  }
  const email = req.body.email;
  const newUser = new User({ email });
  newUser
    .save()
    .then(() => res.status(200).json("User Added!"))
    .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/file").post((req, res) => {
  console.log("Uploading file...");
  if (req.headers.secret != process.env.SECRET) {
    return res.status(401).json("You shall not pass... without password");
  }
  const email = req.headers.email;
  const file = req.body.file; //file trying to upload
  const selectedUser = User.findOne({ email: email }); //get user by email
  let filenameExists = false;
  selectedUser
    .then((user) => {
      fileList = user.files;
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].fileInfo.filename == file.fileInfo.filename) {
          filenameExists = true;
        }
      }
      if (!filenameExists) {
        console.log("Pushing file!");
        user.files.push(file);
        user
          .save()
          .then(() => res.status(200).json("File Added."))
          .catch((err) => res.status(400).json("ERROR: " + err));
      } else {
        throw "Filename already exists";
      }
    })
    .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/file").delete((req, res) => {
  if (req.headers.secret != process.env.SECRET) {
    return res.status(401).json("You shall not pass... without password");
  }
  const email = req.headers.email;
  const filename = req.body.filename; //file trying to upload
  const selectedUser = User.findOne({ email: email }); //get user by email
  let fileIndex = -1;
  selectedUser
    .then((user) => {
      fileList = user.files;
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].fileInfo.filename == filename) {
          fileIndex = i;
        }
      }
      if (fileIndex > -1) {
        user.files.splice(fileIndex, 1); //deletes the element at fileIndex
        user
          .save()
          .then(() => res.status(200).json("File Deleted."))
          .catch((err) => res.status(400).json("ERROR: " + err));
      } else {
        throw "Filename does not exist";
      }
    })
    .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/ActiveFile").post((req, res) => {
  console.log("Setting active file...");
  if (req.headers.secret != process.env.SECRET) {
    return res.status(401).json("You shall not pass... without password");
  }
  const email = req.headers.email;
  const filename = req.body.filename;
  const selectedUser = User.findOne({ email: email }); //get user by email
  selectedUser
    .then((user) => {
      fileList = user.files;
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].fileInfo.filename == filename) {
          fileIndex = i;
        }
      }
      if (fileIndex > -1) {
        user.activeFile = filename; //deletes the element at fileIndex
        user
          .save()
          .then(() => res.status(200).json("Active File Set."))
          .catch((err) => res.status(400).json("ERROR: " + err));
      } else {
        throw "Filename does not exist";
      }
    })
    .catch((err) => res.status(400).json("ERROR: " + err));
});

router.route("/ActiveFile").delete((req, res) => {
  console.log("Deleting active file...");
  if (req.headers.secret != process.env.SECRET) {
    return res.status(401).json("You shall not pass... without password");
  }
  const email = req.headers.email;
  const filename = req.body.filename;
  const selectedUser = User.findOne({ email: email }); //get user by email
  selectedUser
    .then((user) => {
      user.activeFile = undefined;
      user
        .save()
        .then(() => res.status(200).json("Active File Set."))
        .catch((err) => res.status(400).json("ERROR: " + err));
    })
    .catch((err) => res.status(400).json("ERROR: " + err));
});

module.exports = router;

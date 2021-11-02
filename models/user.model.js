const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/*
SCHEMA DESIGN EXAMPLE:

user:
    email: 'example@gmail.com'
files: [Object, Object, Object]


getUser('example@gmail.com').files[0] <--- Returns their first uploaded file
getUser('example@gmail.com').files[0].fileInfo.fileName <--- Returns the name of the file
*/

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    files: [
      {type: Object, required: true },
    ],
    activeFile: {type: String}
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

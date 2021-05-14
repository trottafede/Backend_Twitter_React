const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    userName: {
      type: String,
      required: [true, "Name Required"],
    },
    email: {
      type: String,
      required: [true, "email Required"],
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    password: String,
    description: String,
    profilePicture: String,
    tweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

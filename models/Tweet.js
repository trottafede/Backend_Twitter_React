const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema(
  {
    text: { type: String, maxlength: 140 },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // AVERIGUAR COMO NO REPETIR LIKES.
    // SI VUELVE A DAR LIKE SACAR EL LIKE.
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tweet", tweetSchema);

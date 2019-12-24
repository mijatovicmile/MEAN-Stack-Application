const mongoose = require("mongoose");

// Models are defined through the Schema interface.
const Schema = mongoose.Schema;

/**
 * Defining Post schema
 *
 * Mongoose schema is configurator object for a Mongoose model.
 * A SchemaType is then a configuration object for an individual property
 *
 * Each schema maps to a MongoDB collection and defines the shape of the documents within that collection
 */
const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.ObjectId, ref: "User", required: true }
});

// Compiling Schema into a model
module.exports = mongoose.model("Post", postSchema);

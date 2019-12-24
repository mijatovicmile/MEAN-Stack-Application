const mongoose = require("mongoose");

// Mongoose Unique Validator
const uniqueValidator = require("mongoose-unique-validator");

// Models are defined through the Schema interface.
const Schema = mongoose.Schema;

/**
 * Defining User schema
 *
 * Mongoose schema is configurator object for a Mongoose model.
 * A SchemaType is then a configuration object for an individual property
 *
 * Each schema maps to a MongoDB collection and defines the shape of the documents within that collection
 */
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/**
 * Unique validator is a plugin that will add an extra hook that checks our data
 * before it saves it to the database.
 *
 * If the user try to save a user with an email that already exist, then he
 * will get an error
 */
userSchema.plugin(uniqueValidator);

// Compiling Schema into a model
module.exports = mongoose.model("User", userSchema);

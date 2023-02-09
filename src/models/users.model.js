// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-type-email");

module.exports = function (app) {
  const modelName = "users";
  const mongooseClient = app.get("mongooseClient");
  const schema = new mongooseClient.Schema(
    {
      userName: {
        type: String,
        unique: true,
        required: [true, "User Name is required"],
      },

      password: { type: String },
      email: {
        type: mongoose.SchemaTypes.Email,
        required: [true, "Email is required"],
      },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};

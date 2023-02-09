const mongoose = require("mongoose");
const logger = require("./logger");

module.exports = function (app) {
  const uri = process.env.DB_URL;
  mongoose.connect(uri).catch((err) => {
    logger.error(err);
    process.exit(1);
  });

  app.set("mongooseClient", mongoose);
};

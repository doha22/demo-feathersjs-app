// Initializes the `ToDo` service on path `/ToDo`
const { ToDo } = require("./to-do.class");
const createModel = require("../../models/to-do.model");
const hooks = require("./to-do.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    lean: true,
  };

  // Initialize our service with any options it requires
  app.use("/ToDo", new ToDo(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("ToDo");

  service.hooks(hooks);
};

const { authenticate } = require("@feathersjs/authentication").hooks;
const errors = require("feathers-errors");
const helpers = require("../../../common/helpers.js");

// Assume
// if  Admin user will assign task for user :  then pass the params : userId
function AssignTask(context) {
  if (
    context.params.query.id === undefined ||
    context.params.query.length == 0
  ) {
    throw new errors.BadRequest("Invalid Parameters");
  } else {
    context.data.userId = context.params.query.id;

    return context;
  }
}

function listTasksByUser(context) {
  let user_id = helpers.getUserId(context); // if no need user_id params
  let tasks = context.app.service("ToDo").find({
    query: {
      userId: context.params.query.userId,
    },
  });

  tasks.catch(function () {
    throw new errors.BadRequest("Task Not Found By User!");
  });

  return tasks;
}

// used when privileges is implemented , and admin user can use that
// if user admin can use that , priveliges not implemented
async function getTaskById(context, taskId) {
  let task = context.app.service("ToDo").find({
    query: {
      _id: taskId,
    },
  });
  task
    .then((task) => {
      console.log("task = ", task);
    })
    .catch(function () {
      throw new errors.BadRequest("Task Not Found !");
    });
  return task;
}

async function getAuthUserTask(context, taskId, user_Id) {
  try {
    let task = await context.app.service("ToDo").find({
      query: {
        _id: taskId,
        userId: user_Id,
      },
    });
    if (!task || task.data.length < 1) {
      throw new errors.BadRequest("Task Not Found !");
    }

    let formatted_user_id = helpers.convertObjId(task.data[0].userId);
    let logged_user = helpers.getUserId(context);

    if (formatted_user_id !== logged_user) {
      throw new errors.Forbidden("User is Not Authorized !");
    }

    return task;
  } catch (err) {
    throw new errors.BadRequest("There is something wrong !", err);
  }
}

async function updateTaskById(context) {
  try {
    let task_id = context.params.query.taskId;

    // let check_task = await getTaskById(context, task_id);
    let logged_user = helpers.getUserId(context);
    let check_task = await getAuthUserTask(context, task_id, logged_user);
    if (!check_task) {
      throw new errors.BadRequest("You Are Not Authenticated ");
    } else {
      let task = await patchTask(context, task_id, context.data);
      context.result = { data: [task] };
      return context;
    }
  } catch (err) {
    throw new errors.BadRequest("There is something wrong !");
  }
}

function patchTask(context, id, data) {
  let task = context.app.service("ToDo").patch(id, data);
  task.catch(function () {
    throw new errors.BadRequest("Task not updated");
  });

  return task;
}

async function deleteTask(context) {
  try {
    let task_id = context.params.query.taskId;
    let logged_user = helpers.getUserId(context);
    let check_task = await getAuthUserTask(context, task_id, logged_user);

    if (!check_task || check_task.data.length < 1) {
      throw new errors.BadRequest("Task Not Found !");
    } else {
      context.id = helpers.convertObjId(check_task.data[0]._id);

      return context;
    }
  } catch (err) {
    throw new errors.BadRequest("There is something wrong !");
  }
}

// Remove userId from task if user is deleted
async function removeUserFromTask() {
  context.app.service("ToDo").remove(null, { query: { userId: context.id } });
  return context;
}

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [listTasksByUser, getAuthUserTask, getTaskById],
    create: [AssignTask],
    update: [updateTaskById],
    patch: [],
    remove: [deleteTask],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [removeUserFromTask],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};

const errors = require("feathers-errors");

function getUserId(context) {
  const user = context.params.user._id;
  let user_id = convertObjId(user);
  return user_id;
}

function convertObjId(ObjId) {
  return ObjId.toString().replace(/ObjectId\("(.*)"\)/, "$1");
}

module.exports.getUserId = getUserId;
module.exports.convertObjId = convertObjId;

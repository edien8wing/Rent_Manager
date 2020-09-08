var logg = require("./log4js.js");
var Users = {};
var userList = [{ name: "yyyy", uid: "123123", depId: 654654 }];
Users.getUid = function (userName) {
  let result;
  userList.forEach((user, key) => {
    if (user.name == userName) {
      result = user.uid;
    }
  });
  return result;
};
Users.getDepId = function (userName) {
  let result;
  userList.forEach((user, key) => {
    if (user.name == userName) {
      result = user.depId;
    }
  });
  return result;
};

module.exports = Users;

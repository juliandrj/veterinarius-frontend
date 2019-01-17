var MenuVM = function () {
  var self = this;
  self.init = function () {
    if (_.isUndefined(vm.login.user())) {
      location.href = '#!/';
    }
  };
};

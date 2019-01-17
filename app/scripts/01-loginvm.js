var LoginVM = function () {
	var self = this;
  self.token = undefined;
  self.user = ko.observable();
  self.usuario = ko.observable();
  self.password = ko.observable();
  self.puedeHacerLogin = ko.computed(function () {
    return self.usuario() && self.password() && self.usuario().length > 0 && self.password().length > 0;
  }, self);
  self.sinLogin = ko.computed(function () {
    return _.isUndefined(self.user()) || _.isUndefined(self.token);
  }, self);
	self.conLogin = ko.computed(function () {
    return !_.isUndefined(self.user()) && !_.isUndefined(self.token);
  }, self);
  self.init = function () {
    if (!_.isUndefined(vm.login.user())) {
      location.href = '#!/menu';
    }
  };
  self.login = function () {
    var loginData = {
      username: self.usuario(),
      password: self.password()
    };
    $.enviarPost('http://backend.veterinarius.com:8000/api/v1/api-token-auth/', loginData,
    function (data) {
      self.token = data.token;
      self.usuario(undefined);
      self.password(undefined);
      $.enviarGet('http://backend.veterinarius.com:8000/api/v1/rest-auth/user/', undefined,
      function (data) {
        self.user(data);
        location.href = '#!/menu';
      });
    },
    function (jqXHR, textStatus, errorThrow) {
      self.usuario(undefined);
      self.password(undefined);
      vm.main.aviso({level:1, header:'Acceso', body:'Tus credenciales incorrectas, intenta nuevamente', closeable: true});
    }, false);
  };
  self.logout = function (goHome = true) {
    $.enviarPost('http://backend.veterinarius.com:8000/api/v1/rest-auth/logout/', undefined,
    function (data) {
      self.user(undefined);
      self.token = undefined;
      if (goHome) {
        location.href = '#!/';
      }
    });
  };
};

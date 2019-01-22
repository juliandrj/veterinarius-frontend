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
    if (self.validarCookie()) {
      location.href = '#!/menu';
    }
  };
	self.validarCookie = function () {
		var uc = $.cookie('xJUAtAvmfgxAsz6D');
    if (!_.isUndefined(uc)) {
			self.token = uc.token;
			self.user(uc.usuario);
      return true;
    }
		return false;
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
					$.cookie('xJUAtAvmfgxAsz6D',{token:self.token,usuario:data},cookieOptions);
	        location.href = '#!/menu';
	      }
			);
    },
    function (jqXHR, textStatus, errorThrow) {
      self.usuario(undefined);
      self.password(undefined);
      vm.main.aviso({level:1, header:'Acceso', body:'Tus credenciales incorrectas, intenta nuevamente', closeable: true});
    }, false);
  };
  self.logout = function () {
		$.removeCookie('xJUAtAvmfgxAsz6D',cookieOptions);
		self.user(undefined);
		self.token = undefined;
    $.enviarPost('http://backend.veterinarius.com:8000/api/v1/rest-auth/logout/', undefined,
    function (data) {
      location.href = '#!/';
    },
		function (jqXHR, textStatus, errorThrow) {
			vm.main.aviso({level:1, header:'Salir', body:errorThrow, closeable: true});
			location.href = '#!/';
		});
  };
};

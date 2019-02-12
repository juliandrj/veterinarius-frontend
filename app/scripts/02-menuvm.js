var MenuVM = function () {
  var self = this;
  self.menu = ko.observableArray();
  self.opcion = 0;
  self.init = function () {
    if (!vm.login.validarCookie()) {
      location.href = '#!/';
      return;
    }
    $.enviarGet('<%= host %>/api/v1/menu/', undefined,
      function (data) {
        self.menu(armarMenu(data));
      },
      function (jqXHR, textStatus, errorThrow) {
        console.log(errorThrow);
      }
    );
  };
  self.setOpcActual = function (opc) {
    self.opcion = opc.id;
    if (opc.ruta) {
      location.href = opc.ruta;
    }
  };
};

var AgendarVM = function () {
  var self = this;
  self.propietarios = ko.observableArray([]);
  self.propietario = ko.observable();
  self.propietario.subscribe(function (p) {
    if (!p) {
      self.mascotas([]);
      return;
    }
    $.enviarGet('http://backend.veterinarius.com:8000/api/v1/mascota/', {propietario: p.id},
    function (data) {
      self.mascotas(data);
    },
    function (jqXHR, textStatus, errorThrow) {
      vm.main.aviso({level: 1, header: 'Listado de mascotas', body: errorThrow, closeable: true});
    });
  });
  self.mascotas = ko.observableArray();
  self.mascota = ko.observable();
  self.medicos = ko.observableArray([]);
  self.medico = ko.observable();
  self.medico.subscribe(function (m) {
    if (!self.mascota() || !m) {
      return;
    }
    $.enviarGet('http://backend.veterinarius.com:8000/api/v1/agenda/', {medico: m.id},
    function (data) {
      var citas = [];
      _.each(data, function (c) {
        var ini = moment(c.fecha, 'YYYY-MM-DD HH:mm:ss');
        citas.push({
          id: c.id,
          title: c.mascota.nombre,
          start: ini.clone().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
          end: ini.clone().add(20, 'm').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
          id_medico: m.value.id,
          id_mascota: c.mascota.id
        });
      });
      $('#div-agenda').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listWeek'
        },
        defaultDate: new Date(),
        editable: true,
        eventClick: function (event) {
          self.evento(event);
          console.log(event);
          self.fechaInicio(event.start.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS));
          self.fechaFin(event.end.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS));
          $('#mdl-cita').modal();
        },
        eventLimit: true,
        events: citas,
        locale: 'es',
        navLinks: true,
        selectable: true,
        selectHelper: true,
        select: function (start, end) {
          self.evento(undefined);
          self.fechaInicio(start.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS));
          $('#mdl-cita').modal();
        },
        themeSystem: 'bootstrap4'
      });
    },
    function (jqXHR, textStatus, errorThrow) {
      vm.main.aviso({level: 1, header: 'Listado de mascotas', body: errorThrow, closeable: true});
    });
  });
  self.evento = ko.observable();
  self.fechaInicio = ko.observable();
  self.fechaInicio.subscribe(function (fi) {
    var mfi = moment(fi, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
    if (mfi.isValid()) {
      self.fechaFin(mfi.add(20, 'm').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS));
    }
  });
  self.fechaFin = ko.observable();
  self.fechaFin.subscribe(function (ff) {
    $('#txt-fecha-ini').datetimepicker('reset');
  });
  self.actualizar = function () {
    if (self.evento()) {
      var e = {
        id: self.evento().id,
        medico: self.evento().id_medico,
        mascota: self.evento().id_mascota,
        fecha: self.fechaInicio()
      };
      $.enviarPut('http://backend.veterinarius.com:8000/api/v1/agendae/' + self.evento().id + '/', e,
      function (data) {
        vm.main.aviso({level:3, header:'Actualizar cita', body:'Cita actualizada con exito', closeable: true});
        self.evento().start = moment(self.fechaInicio(), moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
        self.evento().end = moment(self.fechaFin(), moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
        $('#div-agenda').fullCalendar('updateEvent', self.evento());
        $('#div-agenda').fullCalendar('unselect');
      },
  		function (jqXHR, textStatus, errorThrow) {
  			vm.main.aviso({level:1, header:'Actualizar cita', body:errorThrow, closeable: true});
  		});
    } else {
      var e = {
        medico: self.medico().value.id,
        mascota: self.mascota().id,
        fecha: self.fechaInicio()
      };
      $.enviarPost('http://backend.veterinarius.com:8000/api/v1/agendae/', e,
      function (data) {
        vm.main.aviso({level:3, header:'Crear cita', body:'Cita creada con exito', closeable: true});
        $('#div-agenda').fullCalendar('renderEvent', {
          title: self.mascota().nombre,
          start: moment(self.fechaInicio(), moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
          end: moment(self.fechaFin(), moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)
        }, true);
        $('#div-agenda').fullCalendar('unselect');
      },
  		function (jqXHR, textStatus, errorThrow) {
  			vm.main.aviso({level:1, header:'Crear cita', body:errorThrow, closeable: true});
  		});
    }
  };
  self.eliminar = function () {
    $.enviarDelete('http://backend.veterinarius.com:8000/api/v1/agendae/' + self.evento().id + '/', undefined,
    function (data) {
      vm.main.aviso({level:3, header:'Eliminar cita', body:'Cita eliminada con exito', closeable: true});
      self.evento().start = moment(self.fechaInicio(), moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
      self.evento().end = moment(self.fechaFin(), moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
      $('#div-agenda').fullCalendar('removeEvents', [self.evento()._id]);
      $('#div-agenda').fullCalendar('unselect');
    },
    function (jqXHR, textStatus, errorThrow) {
      vm.main.aviso({level:1, header:'Eliminar cita', body:errorThrow, closeable: true});
    });
  };
  self.init = function () {
    if (!vm.login.validarCookie()) {
      location.href = '#!/';
      return;
    }
    $('#txt-fecha-ini').datetimepicker({
      i18n: {es: es},
      format: moment.HTML5_FMT.DATETIME_LOCAL_SECONDS,
      inline: true,
      minDate: 0,
      lang: 'es'
    });
    $.enviarGet('http://backend.veterinarius.com:8000/api/v1/medico/', undefined,
    function (data) {
      self.medicos([]);
      _.each(data, function (m) {
        self.medicos.push(new personaSel(m));
      });
      $.enviarGet('http://backend.veterinarius.com:8000/api/v1/propietario/', undefined,
      function (data) {
        self.propietarios([]);
        _.each(data, function (p) {
          self.propietarios.push(new personaSel(p));
        });
      },
      function (jqXHR, textStatus, errorThrow) {
        vm.main.aviso({level: 1, header: 'Listado de propietarios', body: errorThrow, closeable: true});
      });
    },
    function (jqXHR, textStatus, errorThrow) {
      vm.main.aviso({level: 1, header: 'Listado de medicos', body: errorThrow, closeable: true});
    });
  };
};

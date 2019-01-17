var MainVM = function () {
	var self = this;
	self.vistas = ko.observableArray(['main','formulario2']);
	self.vistaActual = ko.observable(self.vistas()[0]);
  self.init = function () {
    console.log('init...');
  };
  self.aviso = ko.observable({level:1, header:'', body:'', closeable: true});
	self.aviso.subscribe(function () {
		var modal = $('#aviso').modal();
		modal.on('hidden.bs.modal', function (e) {
			vm.main.loading(false);
		});
	});
	self.alerta = ko.observable();//{level:1, head:'', body:''}
	self.alerta.subscribe(function () {
		$('#alerta').removeClass('d-none').addClass('show');
		$('#alerta').animateCss('bounceInRight');
	});
	self.cerrarAlerta = function () {
		$('#alerta').animateCss('bounceOutUp', function () {
			$('#alerta').removeClass('show').addClass('d-none');
		});
	};
	self.loading = ko.observable();
	self.loading.subscribe(function (newLoading) {
		if (newLoading) {
			$('#loading').modal();
			console.log('abre loading...');
		} else {
			$('#loading').modal('hide');
			console.log('cierra loading...');
		}
	});
};

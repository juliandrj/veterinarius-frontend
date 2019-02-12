var vm = {
	main: new MainVM(),
  login: new LoginVM(),
  menu: new MenuVM(),
	agendar: new AgendarVM()
};
$(document).ready(function () {
	vm.main.init();
	ko.applyBindings(vm);
	var app = $.sammy('#main', function() {
		//Define la URL por defecto
		this.get('/', function () {
			this.partial('html/login.html').then(function(){
				renderizar('login');
			});
		});
		//Define las URLs y carga el [:view].html correspondiente
		this.get('#!/:view', function () {
			vm.main.loading(true);
			var vista = this.params.view;
			console.log('vista: ' + vista);
			var x = this.partial('html/' + vista + '.html').then(function(){
				renderizar(vista);
				vm.main.loading(false);
			});
			vm.main.vistaActual(this.params.view);
		});
	}).run();
});

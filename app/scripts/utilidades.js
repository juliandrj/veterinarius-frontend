$(document).ajaxSend(function (event, xhr, settings) {
	settings.xhrFields = {
		withCredentials: true
	};
});
$.fn.extend({
	animateCss: function(animationName, callback) {
		var animationEnd = (function(el) {
				var animations = {
				animation: 'animationend',
				OAnimation: 'oAnimationEnd',
				MozAnimation: 'mozAnimationEnd',
				WebkitAnimation: 'webkitAnimationEnd',
			};
			for (var t in animations) {
				if (el.style[t] !== undefined) {
					return animations[t];
				}
			}
		})(document.createElement('div'));
		this.addClass('animated ' + animationName).one(animationEnd, function() {
			$(this).removeClass('animated ' + animationName);
			if (typeof callback === 'function') callback();
		});

		return this;
	},
});
var renderizar = function (vista) {
	var nodo = $('#main-section');
	ko.cleanNode(nodo[0]);
	nodo.html($('#main').html());
	$('#main').html('');
	if (vm[vista] && typeof vm[vista].init === 'function') {
		vm[vista].init();
	} else {
		console.log(' * ' + vista + ' vista sin init()');
	}
	ko.applyBindings(vm, nodo[0]);
	console.log(' --> ' + vista);
};
$.enviarGet = function (url, data, callback, errorCallback = undefined, credentials = true) {
	var headers = vm && vm.login && vm.login.token ? {'Authorization': 'JWT ' + vm.login.token} : {};
	return $.ajax({
		crossDomain: true,
		xhrFields: {
			withCredentials: credentials
		},
		headers: headers,
    type: 'GET',
    url: url,
    contentType: 'application/json; charset=utf-8',
    data: data,
    success: callback,
    error: errorCallback
  });
};
$.enviarPost = function (url, data, callback, errorCallback = undefined, credentials = true) {
	var headers = vm && vm.login && vm.login.token ? {'Authorization': 'JWT ' + vm.login.token} : {};
  return $.ajax({
		crossDomain: true,
		xhrFields: {
			withCredentials: credentials
		},
		headers: headers,
    type: 'POST',
    url: url,
    contentType: 'application/json; charset=utf-8',
    data: ko.toJSON(data),
    dataType: 'json',
    success: callback,
    error: errorCallback
  });
};

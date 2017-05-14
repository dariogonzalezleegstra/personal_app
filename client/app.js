var myApp = angular.module('myApp',['ngRoute']);
myApp.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl:'templates/list.html',
			controller:'empController'
		})
		.when('/personals', {
			templateUrl:'templates/list.html',
			controller:'empController'
		})
		.when('/personals/create', {
			templateUrl:'templates/add.html',
			controller:'empController'
		})
		.when('/personals/:id/edit', {
			templateUrl:'templates/edit.html',
			controller:'empController'
		})
		.when('/personals/:id/show', {
			templateUrl:'templates/show.html',
			controller:'empController'
		})
		.when('/personals/:id/entry', {
			templateUrl:'templates/entry.html',
			controller:'empController'
		})
		.when('/report', {
			templateUrl:'templates/reporte.html',
			controller:'empController'
		});
});

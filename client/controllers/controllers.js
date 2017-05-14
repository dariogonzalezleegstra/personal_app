myApp.controller('empController', function($scope,$filter,$route,$routeParams,$http){
	$scope.getPersonals = function(){
		$http.get('/api/personals/').then(function(response){
			$scope.personals = response.data;
		});
	};
	$scope.showPersonal = function(){
		var id = $routeParams.id;
		$http.get('/api/personals/'+ id).then(function(response){
			$scope.personal = response.data;
		});
	};
	$scope.addPersonal = function(){

		$http.post('/api/personals/', $scope.personal).then(function(response){

			window.location.href = '/';
		});
	};

	$scope.updatePersonal = function(){
		var id = $routeParams.id;
		$http.put('/api/personals/'+ id , $scope.personal).then(function(response){
			//$scope.personal = response.data;
			window.location.href = '/';
		});
	};
	$scope.deletePersonal = function(id){
		var id = id;
		$http.delete('/api/personals/'+ id).then(function(response){
			$route.reload();
		});
	};

	// ----

	$scope.addEntry = function(){
		var id = $routeParams.id;
		$http.get('/api/lastEE/' + id).then(function(response){

			if(response.data == null || response.data.type == 'exit'){
				$http.post('/api/entry/'+id).then(function(response){
					alert('Entrada registrada correctamente');
					window.location.href = '/';
				});
			}
			else{
			  alert('Por favor, registre su salida para poder efectuar una nueva entrada.');
			}
		});
		};

	$scope.addExit = function(){
		var id = $routeParams.id;
		$http.get('/api/lastEE/' + id).then(function(response){

			if(response.data !== null && response.data.type == 'entry'){
				$http.post('/api/exit/'+id).then(function(response){
				alert('Salida registrada correctamente');
				window.location.href = '/';
				});
			}
			else{
				alert('No tiene entradas pendientes de finalizar. Por favor, realice una entrada para registrar una salida.');
			}
		});
	};
	// ----


	$scope.getHoursByDay = function(){

		$http.post('/api/personalIdByName', $scope.report).then(function(response){

				if(response.data[0] == undefined){
					alert('El usuario seleccionado no existe');
				}
				else{
					$scope.report.idUser = response.data[0]._id;
					console.log('$scope: ');
					console.log($scope.report);
				

					$http.post('/api/hoursbyday/', $scope.report).then(function(response){

						//response.data contiene un arreglo de cada entryexit(obj), ordenado por mas reciente

						if (response.data[0] == undefined){
							alert('El personal indicado no trabajó en el día consultado. Por favor, recuerde escribir la fecha con un formato "01-01-2000".')
						}
						else{
							console.log('response :');
							console.log(response.data);
							var hours = calculateHours(response.data);
							alert('El personal indicado trabajó '+hours+" hora/s el día seleccionado.");
						}

						});
		}
		});
	};

});

	function calculateHours(entryexits){
			var i = 0;
			var totalHours = 0;

			while(entryexits[i] !== undefined){
				var startTime = moment(entryexits[i].alta, 'DD-MM-YYYY hh:mm:ss');
				var endTime = moment(entryexits[i+1].alta, 'DD-MM-YYYY hh:mm:ss');
				totalHours = totalHours+(endTime.diff(startTime, 'hours'));

				i = i+2;
		}

		return (totalHours);
	}

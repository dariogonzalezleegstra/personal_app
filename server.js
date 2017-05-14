var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/personals');
var Schema = mongoose.Schema;
var moment = require('moment');


var schemaPersonal = new Schema({
	nombre:String,
	dni:String,
	f_nac:String,
	});

var Personal = mongoose.model('Personal', schemaPersonal);

var schemaEntryExit = new Schema({
	id_pers: {type: Schema.Types.ObjectId, ref: 'Personal'},
	type: String, //Entry or exit
	alta: {type: String, default:
		moment(new Date()).format("DD-MM-YYYY H:mm:ss") }

});

var EntryExit = mongoose.model('EntryExit', schemaEntryExit);


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));

app.get('/api/personals', function(req, res){
	Personal.find(function(err, personals){
		if(err)
			res.send(err);
		res.json(personals);
	});
});

app.get('/api/personals/:id', function(req, res){
	Personal.findOne({_id:req.params.id}, function(err, personal){
		if(err)
			res.send(err);
		res.json(personal);
	});
});
app.post('/api/personals', function(req, res){
	Personal.create( req.body, function(err, personals){
		if(err)
			res.send(err);
		res.json(personals);
	});
});

app.delete('/api/personals/:id', function(req, res){
	Personal.findOneAndRemove({_id:req.params.id}, function(err, personal){
		if(err)
			res.send(err);
		res.json(personal);
	});
});
app.put('/api/personals/:id', function(req, res){
	var query = {
		nombre:req.body.nombre,
		dni:req.body.dni,
		f_nac:req.body.f_nac
	};
	Personal.findOneAndUpdate({_id:req.params.id}, query, function(err, personal){
		if(err)
			res.send(err);
		res.json(personal);
	});
});

// ------------

app.get('/api/entryexits', function(req, res){
	EntryExit.find(function(err, entryexit){
		if(err)
			res.send(err);
		res.json(entryexit);
	});
});


app.get('/api/lastEE/:id', function(req, res){
	//Fetch del ultimo Entrada/Salida insertado para el id_pers traido por parametro
	var id_pers = req.params.id;
	console.log("id de la persona: "+id_pers);
	EntryExit.findOne({'id_pers': req.params.id}, null, { sort: { '_id' : -1 } }, function(err, obj) {
		if(err)
			res.send(err);
	  console.log('console.log: '+obj);
		res.json(obj);
	});

});


app.post('/api/entry/:id', function(req, res){
	console.log('entro a /entry');
	var params = {id_pers: req.params.id, type: 'entry'};
	EntryExit.create( params, function(err, entries){
		if(err)
			res.send(err);
		res.json(entries);
	});
});


app.post('/api/exit/:id', function(req, res){
	var params = {id_pers: req.params.id, type: 'exit'};
	EntryExit.create( params, function(err, exits){
		if(err)
			res.send(err);
		res.json(exits);
	});
});


//------------

app.post('/api/personalIdByName', function(req, res){
	Personal.find({'nombre': req.body.nombre}, function(err, obj){
			if(err)
				res.send(err);
			res.json(obj);
	});
});

app.post('/api/hoursbyday', function(req, res){

	console.log("id: "+req.body.idUser);
	console.log("fecha: "+req.body.f_con);
	//LUEGO TRAER EL NOMBRE DE VERDAD Y NO UN ID
	EntryExit.find({'alta': {'$regex': req.body.f_con}, 'id_pers': req.body.idUser}, null, { sort: { 'alta' : -1 } }, function(err, obj) {
		if(err)
			res.send(err);
		res.json(obj);
	});
});


app.listen(3000, function(){
	console.log('server funcionando en port :3000');
});

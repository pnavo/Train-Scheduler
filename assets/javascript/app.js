$(document).ready(function() {
	  // Initialize Firebase
	  var config = {
	    apiKey: "AIzaSyCdPWvlPvOzCttoMRveXSewJEka76jWjj0",
    	authDomain: "cmon-ride-the-train.firebaseapp.com",
	    databaseURL: "https://cmon-ride-the-train.firebaseio.com",
	    projectId: "cmon-ride-the-train",
	    storageBucket: "cmon-ride-the-train.appspot.com",
	    messagingSenderId: "893732995428"
	  };

	  firebase.initializeApp(config);

	  var database = firebase.database();
	  var train = "";
	  var destination = "";
	  var trainTime = "";
	  var frequency = "";

	  $("#submit").on('click', function() {

	  	event.preventDefault();

	  	train = $('#train').val().trim();
	  	destination = $('#destination').val().trim();
	  	trainTime = $('#train-time').val().trim();
	  	frequency = $('#frequency').val().trim();
	  	frequency = (parseInt(frequency));

	  	if ((train==="") || (destination==="") || (trainTime==="") || (frequency==="")) {
	  		console.log('complete');
	  	} else if (Number.isInteger(frequency) === false) {
	  		console.log('freq');
	  	} else {
	  		$('#train').val('');
	  		$('#destination').val('');
	  		$('#train-time').val('');
	  		$('#frequency').val('');
	  	}

	  	database.ref().push({
		  	train : train,
		  	destination : destination,
		  	trainTime : trainTime,
		  	frequency : frequency
	  	});
	  });

	  database.ref().on("child_added", function(snapshot) {

	  	var keyID = snapshot.key;

	  	var train = snapshot.val().train;
	  	var destination = snapshot.val().destination;
	  	var trainTime = snapshot.val().trainTime;
	  	var frequency = snapshot.val().frequency;

	  	var firstTrain = moment(trainTime, "HH:mm");
	  	var currentTime = moment();

	  	var difference = currentTime.diff(firstTrain, 'minutes');
	  	var away = 0;
	  	var nextTrain = moment();

	  	if (difference <= 0) {
	  		away = -difference;
	  		nextTrain = firstTrain;
	  	} else {
	  		var frequencyInt = parseInt(frequency);
	  		var sinceLast = (difference % frequencyInt);
	  		away = (frequencyInt - sinceLast);
	  		nextTrain = currentTime.add(away, 'minutes');
	  	}

	  	var newRow = $('<tr>').attr('id', keyID);
	  	newRow.append($('<td>').text(train));
	  	newRow.append($('<td>').text(destination));
	 	newRow.append($('<td class="text-center">' + frequency + '</td>'));
	  	newRow.append($('<td class="text-center">').html(nextTrain.format('HH:mm')));
	  	newRow.append($('<td class="text-center">').html(away));

	  	$('#new-row').append(newRow);
	  
	  });
	  
	});
var noble = require('noble/with-bindings')(require('noble/lib/webbluetooth/bindings'));
var _ = require('lodash');


var serviceUUIDs = ["heart_rate"];
var allowDuplicates = false;

var output = document.getElementById('output');
var errorOutput = document.getElementById('errorOutput');

function displayError(error){
  console.log(error);
  errorOutput.innerHTML = 'error: ' + error;
}

noble.on('error', displayError);
noble._bindings.on('error', displayError);


noble.on('stateChange', function(state){
  console.log('state change', state);
});

noble.on('discover', function(peripheral){
  console.log('peripheral found!', peripheral);
  peripheral.connect(function(error){
    if(error){
      return console.error('error connecting to peripheral', error);
    }
    console.log('connected to peripheral', peripheral);

    peripheral.on('servicesDiscover', function(services){
      console.log('serivces discovered', services);

      services[0].on('characteristicsDiscover', function(characteristics){
        console.log('characteristics Discovered', characteristics);

        characteristics.forEach(function(characteristic){
          if(_.includes(characteristic.properties, 'notify')){
            characteristic.on('data', function(data){ //logs sensor data
              console.log('subscription data', data);
              output.innerHTML = 'notify value: ' + new Buffer(data).toString('hex');
            });
            console.log('subscribing to notifications on', characteristic);
            characteristic.subscribe(function(error){ if(error){ console.error('error subscribing', error); }});
          }
          if(_.includes(characteristic.properties, 'read')){
            characteristic.on('data', function(data){ //tells location of body sensor
              console.log('read data', data);
              output.innerHTML = 'read value: ' + new Buffer(data).toString('hex');
            });
            console.log('reading data from', characteristic);
            characteristic.read(function(error){ if(error){ console.error('error reading', error); }});
          }
        });

      });

      services[0].discoverCharacteristics();

    });

    peripheral.discoverServices();


  });

});


document.getElementById("scanBtn").addEventListener("click", function( event ) {
  try{
    noble.startScanning(serviceUUIDs, allowDuplicates);
  }catch(error){ displayError(error); }
}, false);

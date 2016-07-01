var noble = require('noble');
var _ = require('lodash');


var serviceUUIDs = ["heart_rate"];
var allowDuplicates = true;

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
            characteristic.on('data', function(data){ console.log('subscription data', data); }); //logs sensor data
            console.log('subscribing to notifications on', characteristic);
            characteristic.subscribe(function(error){ if(error){ console.error('error subscribing', error); }});
          }
          if(_.includes(characteristic.properties, 'read')){
            characteristic.on('data', function(data){ console.log('read data', data); }); //tells location of body sensor
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

noble.on('warning', function(waring){
  console.warn(waring);
});

noble.on('error', function(error){
  console.warn(error);
});


document.getElementById("scanBtn").addEventListener("click", function( event ) {
  noble.startScanning(serviceUUIDs, allowDuplicates);
}, false);

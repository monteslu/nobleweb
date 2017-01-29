var noble = require('noble/with-bindings')(require('noble/lib/webbluetooth/bindings'));
var _ = require('lodash');


var allowDuplicates = false;

var servicesDiv = document.getElementById('services');
var serviceInput = document.getElementById('serviceInput');
var errorOutput = document.getElementById('errorOutput');
var deviceNameInput = document.getElementById('deviceName');


global.noble = noble;

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
      displayError(eror);
      return console.error('error connecting to peripheral', error);
    }
    console.log('connected to peripheral', peripheral);

    peripheral.on('servicesDiscover', function(services){
      console.log('serivces discovered', services);
      global.services = services;

      servicesDiv.innerHTML = '';


      services.forEach(function(service){

        var serviceDiv = document.createElement('div');

        serviceDiv.id = service.uuid;
        serviceDiv.className = 'roundbox service demo-card-wide mdl-card mdl-shadow--2dp';

        var serviceLabelDiv = document.createElement('div');
        serviceLabelDiv.className = "serviceLabel mdl-card__title mdl-card--expand";
        serviceLabelDiv.textContent = 'service: ' + service.uuid;
        serviceDiv.appendChild(serviceLabelDiv);

  //
  //       <div class="mdl-card__title mdl-card--expand">
  //   <h2 class="mdl-card__title-text">Update</h2>
  // </div>

        var charsDiv = document.createElement('div')
        charsDiv.id = service.uuid + 'chars';
        serviceDiv.appendChild(charsDiv);

        servicesDiv.appendChild(serviceDiv);

        service.on('characteristicsDiscover', function(characteristics){

          console.log('characteristics Discovered', characteristics);

          characteristics.forEach(function(characteristic){

            var charDiv = document.createElement("div");
            charDiv.id = characteristic.uuid;
            charDiv.className = 'roundbox characteristic demo-card-wide mdl-shadow--2dp';
            charsDiv.appendChild(charDiv);

            var charSpan = document.createElement("span");
            charSpan.textContent = 'characteristic: ' + characteristic.uuid;
            charDiv.appendChild(charSpan);

            var charValDiv = document.createElement("div");
            charDiv.appendChild(charValDiv);

            var charValLabel = document.createElement("span");
            charValLabel.textContent = "value: ";
            charValDiv.appendChild(charValLabel);

            var charValVal = document.createElement("span");
            charValVal.textContent = '';
            charValVal.className = 'charValue';
            charValDiv.appendChild(charValVal);

            var charValDate = document.createElement("span");
            charValVal.textContent = '';
            charValDiv.appendChild(charValDate);


            _.forEach(characteristic.properties, function(prop){


              var propDiv = document.createElement("div");
              // propDiv.textContent = prop;
              charDiv.appendChild(propDiv);
              propDiv.className = 'roundbox property demo-card-wide mdl-shadow--2dp';

              var propControls = document.createElement("div");
              propControls.id = characteristic.uuid + prop + 'controls';
              propDiv.appendChild(propControls);


              characteristic.on('data', function(data, isNotification){ //tells location of body sensor
                console.log('char data', data, isNotification, characteristic.uuid);
                charValVal.textContent = new Buffer(data).toJSON().data;
                charValDate.textContent = " at: " + new Date().toTimeString();
              });

              if(prop === 'notify'){
                var subBtn = document.createElement('button');
                subBtn.textContent = 'Subscribe';
                subBtn.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                propControls.appendChild(subBtn);

                subBtn.addEventListener("click", function( event ) {
                  subBtn.disabled = true;
                  console.log('sub/unsub to data from', characteristic.uuid);

                  if(!characteristic.subbed){
                    characteristic.subscribe(function(error){
                      if(error){
                        subBtn.disabled = false;
                        console.error('error subscribing', error);
                      }
                      else{
                        subBtn.disabled = false;
                        subBtn.textContent = 'unsubscribe';
                        characteristic.subbed = true;
                      }
                    });
                  }
                  else{
                    characteristic.unsubscribe(function(error){
                      if(error){
                        subBtn.disabled = false;
                        console.error('error unsubscribing', error);
                      }
                      else{
                        subBtn.disabled = false;
                        subBtn.textContent = 'subscribe';
                        characteristic.subbed = false;
                      }
                    });
                  }

                }, false);

              }

              if(prop === 'read'){
                var readBtn = document.createElement('button');
                readBtn.textContent = 'read';
                readBtn.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                propControls.appendChild(readBtn);

                readBtn.addEventListener("click", function( event ) {
                  console.log('reading data from', characteristic.uuid);
                  characteristic.read(function(error){ if(error){ console.error('error reading', error); }});
                }, false);

              }


              if(prop === 'write' || prop === "writeWithoutResponse"){

                var writeInput = document.createElement('input');
                writeInput.type = 'text';
                writeInput.className = "mdl-textfield__input";
                propControls.appendChild(writeInput);

                var writeBtn = document.createElement('button');
                writeBtn.textContent = prop;
                writeBtn.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";
                propControls.appendChild(writeBtn);

                writeBtn.addEventListener("click", function( event ) {
                  var raw = _.trim(writeInput.value);
                  raw = raw.split(',');
                  writeInput.value = '';

                  var bytes = [];
                  raw.forEach(function(r){
                    if(r){
                      bytes.push(Number(r));
                    }
                  })
                  characteristic.write(new Buffer(bytes), true);

                }, false);


              }

            });



          });

        });

        service.discoverCharacteristics();

      });



    });

    peripheral.discoverServices();


  });

});


document.getElementById("scanBtn").addEventListener("click", function( event ) {
  try{
    var filter = {};
    if(serviceInput.value){
      var ids = serviceInput.value.split(',');
      ids = _.map(ids, _.trim);
      filter.services = ids;
    }
    // if(deviceNameInput.value){
    //   filter.name = deviceNameInput.value;
    // }
    noble.startScanning(filter, allowDuplicates);
  }catch(error){
    displayError(error);
  }
}, false);

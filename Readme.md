NobleWeb 
========

Simple app using noble with webpack to read a heart rate monitor.  You can use the [BLE Peripheral Simulator](https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral&hl=en) to transmit heart rate data:  

This app is up and running at: [https://nobleweb.surge.sh](https://nobleweb.surge.sh)

Or you can run it locally: 

## Build it

```
npm install
npm run build
````

## Run it

```
npm run start
````

## View it

Make sure you're using a compatible browser with the appropriate flags turned on: 
[status page](https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md)

Then view the app: 
[http://localhost:3000](http://localhost:3000)


There's not much to the UI except for a button and some simple output messages of the raw data or errors.



const status = document.getElementById('ambient');
if ( 'AmbientLightSensor' in window ) {
  const sensor = new AmbientLightSensor();
  sensor.onreading = () => {
    status.innerText = `'Current light level: ${sensor.illuminance}`;
  };
  sensor.onerror = (event) => {
    status.innerText = `${event.error.name} ${event.error.message}`;
  };
  sensor.start();
} else {
  status.innerText = 'Not supported by browser'; 
}

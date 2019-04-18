// Intercept any network requests
self.addEventListener("fetch", function(event){
    
    //console.log("Service worker intercepting fetch event: ", event);
    
    if(event.request.url.startsWith('https://www.bing.com')){
        networkOnly(event);
        return;
    }
   cacheThenNetwork(event);
});

const myMap = document.getElementById('myMap');

if(myMap) {
    if (navigator.onLine) {
        let bing = "https://www.bing.com/api/maps/mapcontrol?key=Ahg1WElCb_XVm3vPr5lk5LAI0JeFZx4BrjWQFgDlM_b3WxlW8yeUOi26SAzFprn_ &callback=loadMapScenario";
        const script = document.createElement('script');
        script.src = bing;
        script.setAttribute('async', true);
        script.setAttribute('defer', true);
        document.body.appendChild(script);
    } else {
        document.getElementById('myMap').classList.add('offline-map');
    }

}
function loadMapScenario() {
    if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
        } else {
        console.log('Locating…');
        navigator.geolocation.getCurrentPosition(success, error);
        }
}
function success(position) {
    myLat = position.coords.latitude;
    myLong = position.coords.longitude;
    console.log(myLat);
    console.log(myLong);
    let map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        center: new Microsoft.Maps.Location(27.70169,85.3206),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 10 });
        var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), null);
        map.entities.push(pushpin);
    }

function error() {
    console.log('Unable to retrieve your location');
    document.getElementById('myMap').innerHTML = "<p>Can't locate you</p>"
    }

  


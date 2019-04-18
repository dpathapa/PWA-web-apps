
// Check that this browser supports serviceWorker
if('serviceWorker' in navigator){

// Wait for the page to completely load, including all resources like the above photo
window.addEventListener('load', function(){

// Register the service worker
navigator.serviceWorker.register("/sw.js").then(function(registration){

// Promise resolved successfully - print registration info to the console
console.log("Service worker registration was successful!", registration);

}, function(err){

// Promise failed, registration did not work
console.log("Service worker registration failed!", err);
});
});
}

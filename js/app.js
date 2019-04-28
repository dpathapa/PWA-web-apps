
let defferedPrompt;

if(!window.Promise ){
  window.Promise = Promise;
}

// Check that this browser supports serviceWorker
if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
  navigator.serviceWorker
    .register("/sw.js")
    .then(function(registration){
        console.log("Service worker registration was successful!", registration);
    },
  function(err){
    console.log("Service worker registration failed!", err);
    });
  });
}
 window.addEventListener('beforeinstallprompt',function(event){
    //  console.log('beforeinstallprompt fired');
     event.preventDefault();
     defferedPrompt = event;
     return false;
});


// // unregister sw
// if('serviceWorker' in navigator){
//   navigator.ServiceWorker.getRegistrations()
//   .then(function(registrations){
//     for (var i = 0; i < registrations.length; i++){
//       registrations[i].unregister();
//     }
//   })
// }
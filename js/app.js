
let defferedPrompt;
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
     console.log('beforeinstallprompt fired');
     event.preventDefault();
     defferedPrompt = event;
     return false;
});
// //promise
// var promise = new promise(function(resolve,reject) {
//     setTimeout(function() {
//         //resolve('This is executed once the timer is done!');
//         reject({code: 500, message:'An erorr occured'})
//         //console.log('This is executed once the timer is done');
//     },3000);
//  });
//  promise.then(function(text){
//      return text;
//  }).then (function(newText){
//      console.log(newText);
//  });
//  console.log('This is executed after setTimeout()' );

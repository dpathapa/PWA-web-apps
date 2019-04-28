importScripts('js/idb.js');
importScripts('js/dbUtility.js');

let CACHE_NAME = 'pwa-site-v8';
let CACHE_DYNAMIC_NAME = 'dynamic-v7';
let CACHE_URLS = [
'index.html',
'manifest.json',
'contact.html',
'share_exp.html',
'adventure.html',
'css/style.css',
'css/gallerystyle.css',
'offline.html',
'fourohfour.html',
'js/map.js',
'js/app.js',
'js/promise.js',
'js/idb.js',
'js/dbUtility.js',
'js/feed.js',
'js/fetch.js',
'image/mane.jpg',
'image/playerflag.jpg',
'image/offline-map.jpg',
'image/logo.png',
'image/tilicho.jpg',
'image/Everest-Skydive.jpeg',
'image/pokharavalley.jpg',
'image/mountainbiking.jpg',
'image/rafting.jpg',
'image/Treking.jpg',
'image/paragliding.jpg',
'image/icons/android-chrome-192x192.png',
'image/icons/android-chrome-512x512.png',
'image/icons/apple-touch-icon.png',
'image/icons/favicon.ico',
'image/fonts/Raleway-Regular.woff2',
'image/fonts/Roboto-Regular.woff2',
 ];

self.addEventListener("install", function(event){
      console.log("Service worker installed", event);
      event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache){
            console.log('[Serveice Woker] Precaching App Shell',event);
            return cache.addAll(CACHE_URLS);
        })
    );
 
});

self.addEventListener('activate', function(event) {
    // console.log('[Serveice Woker] Activating Service Worker...',event);
    event.waitUntil(
      caches.keys()
        .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
            }
          })
        );
      })
    );
    return self.clients.claim();
  });

  function isInArray(string,array){
      for(let i=0;i<array.length; i++){
          if(array[i] === string){
              return true;
          }
      }
      return false;
  }
//Fetching items from the cache
  self.addEventListener('fetch', function(event){  
    let url = "https://portfolio-deepa.firebaseio.com/reviews";    
    if (event.request.url.indexOf(url) >-1){
        event.respondWith(fetch(event.request)
                .then(function (res) {
                let clonedRes = res.clone();
                clearAllData('reviews')
                .then(function(){
                  return clonedRes.json();
                })
                  .then(function(data){
                      for (let key in data) {
                      writeData('reviews', data[key])
                      // .then(function(){
                      //   deleteItemFromData('reviews',key);
                      // });
                   }          
                });
            return res;
         })
      ); 
//else if(new RegExp('\\b' + STATIC_FILES.join('\\b|\\b')+ '\\b').tezt(event.request.url)){
    }else if (isInArray(event.request.url,CACHE_URLS)){
        event.respondWith(
            caches.match(event.request)
    );
    }else {
        event.respondWith(caches.match(event.request)
           .then(function(response){
            if(response){
               return response;
        }else{            
            return fetch(event.request)
            .then(function(res){
                return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                })
            })
            .catch(function(err){
                return caches.open(CACHE_NAME)
                .then(function (cache){
                 if (event.request.headers.get('accept').includes('html')){
                return cache.match('offline.html');
                 }
                });
             });
           }
        })
      );
    }
});
// Intercept any network requests
self.addEventListener("fetch", function(event){
    
    //console.log("Service worker intercepting fetch event: ", event);
    
    if(event.request.url.startsWith('https://www.bing.com')){
        networkOnly(event);
        return;
    }

   cacheThenNetwork(event);
});



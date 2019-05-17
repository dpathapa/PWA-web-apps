importScripts('js/idb.js');
importScripts('js/dbUtility.js');


let CACHE_NAME = 'pwa-site-v16';
let CACHE_DYNAMIC_NAME = 'dynamic-v2';
let CACHE_URLS = [
'index.html',
'manifest.json',
'misc.html',
'share_exp.html',
'adventure.html',
'css/style.css',
'css/gallerystyle.css',
'offline.html',
'js/map.js',
'js/app.js',
'js/promise.js',
'js/idb.js',
'js/dbUtility.js',
'js/feed.js',
'js/fetch.js',
'battery.js',
'device.js',
'ambient.js',
'image/mane.jpg',
'image/mane200x200.jpg',
'image/mane400x400.jpg',
'image/mane600x600.jpg',
'image/mountainbiking200x200.jpg',
'image/mountainbiking400x400.jpg',
'image/mountainbiking600x600.jpg',
'image/Bungy200x200.jpg',
'image/Bungy400x400.jpg',
'image/Bungy600x600.jpg',
'image/sky200x200.jpg',
'image/sky400x400.jpg',
'image/sky600x600.jpg',
'image/Treking200x200.jpg',
'image/Treking400x400.jpg',
'image/Treking600x600.jpg',
'image/playerflag-200.jpg',
'image/playerflag-400.jpg',
'image/playerflag-600.jpg',
'image/playerflag.jpg',
'image/offline-map.jpg',
'image/logo.png',
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
//

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
                 if (event.request.headers.get('accept').includes('.html')){
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

self.addEventListener('sync', function(event) {
  console.log('[Service Worker] Background syncing', event);
  if (event.tag === 'sync-new-reviews') {
    console.log('[Service Worker] Syncing new Posts');
    event.waitUntil(
      readAllData('sync-posts')
        .then(function(data) {
          for (var dt of data) {
            var postData = new FormData();
            postData.append('id', dt.id);
            postData.append('title', dt.title);
            postData.append('location', dt.location);
            postData.append('file', dt.picture, dt.id + '.png');

            fetch('https://portfolio-deepa.firebaseio.com/reviews.json', {
              method: 'POST',
              body: postData
            })
              .then(function(res) {
                console.log('Sent data', res);
                if (res.ok) {
                  res.json()
                    .then(function(resData) {
                      deleteItemFromData('sync-reviews', resData.id);
                    });
                }
              })
              .catch(function(err) {
                console.log('Error while sending data', err);
              });
          }

        })
    );
  }
});
//sync form 
self.addEventListener('sync', function(event){
  console.log('[Service Worker] Background syncing', event);
  if(event.tag === 'sync-new-review'){
    console.log('[Service Worker] syncing new reviews', event);
    event.waitUntil(
      readAllData('sync-review')
      .then(function(data){
        for (let dt of data){
          fetch(' https://portfolio-deepa.firebaseapp.com',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application.json'
            },
            body: JSON.stringify({
              id: dt.id,
              title: dt.title,
              location: dt.location,
              image: 'https://firebasestorage.googleapis.com/v0/b/portfolio-deepa.appspot.com/o/Bungy.jpeg?alt=media&token=3f61b7aa-14ca-4ad3-9f1b-0c37469c7cea'
            })
          })
            .then(function(res){
              console.log('Sent data', res);
              if(res.ok){
                deleteItemFromData('sync-review', dt.id);
              }      
          })
          .catch(function(err){
            console.log('Error while sending data'.err);
          })
        }
        
      })
    );
  }
})


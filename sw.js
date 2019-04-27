const CACHE_NAME = 'pwa-site-v5';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_URLS = ['index.html',
'manifest.json',
'/',
'contact.html',
'share_exp.html',
'adventure.html',
'css/style.css',
'css/gallerystyle.css',
'offline.html',
'404.html',
'js/map.js',
'js/feed/js',
'js/app.js',
'js/fetch.js',
'js/promise.js',
'js/material.min.js',
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
// Wait until we have been notified that we are installed
self.addEventListener("install", function(event){
    // Announce that we are installed
    console.log("Service worker installed", self);
    // Create a cache, and add the resources to the cache
    // Tell the "install" event to wait for the promises to resolve before it completes
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            // Cache has been opened - Now add all URLs to the cache
            return cache.addAll(CACHE_URLS);
        })
    );
 
});
//On activate update the cache with the new version and clean out old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(keyList.map(function(key){
            if(key!==CACHE_NAME && key!==CACHE_DYNAMIC_NAME){
                console.log('[Service Worker] Removing old cache.',key);
                return caches.delete(key);
            }
        })
        //can be done either with key or cacheName shown below:
        //   cacheNames.map(function(cacheName) {
        //     if (cacheName.startsWith('pwa-site') && CACHE_NAME !== cacheName) {
        //         return caches.delete(cacheName);
        //     }  
        //   })
        );
      })
    );
    return self.clients.claim();
  });
//Fetching items from the cache
  self.addEventListener("fetch", function(event){    
    // We have intercepted a fetch request, how should we respond?
    // -> If we have a match for the resource in our cache, respond with it!
    // -> Otherwise, return an "outside" fetch request for it (try to go to the network to get it)
    event.respondWith(caches.match(event.request)
    .then(function(response){
            // Did we find a match for this request in our caches?
            if(response){
                // Yes, return it from the cache
               // console.log('Returning ${event.request.url} from cache!');
                return response;
            }else{
            // No, so return an outside fetch request for it (go to network)
                // console.log('Sorry, ${event.request.url} not found in cache');
            return fetch(event.request)
            //add this line to fetch dynamic contents
            .then(function(res){
                return caches.open('dynamic')
                .then(function(cache){
                    cache.put(event.request.url, res.clone());
                    return res;
                })
            });
            }
        })
    );

});


// Cache only
const cacheOnly = (event) => {
    event.respondWith(caches.match(event.request));
};

// Network only
const networkOnly = (event) => {
    event.respondWith(fetch(event.request));
};

// Cache, then network fallback
const cacheThenNetwork = (event) => {
    event.respondWith(
        caches.match(event.request).then(function(response){

            // Did we find a match for this request in our caches?
            if(response){
                // Yes, return it from the cache
                console.log('Returning ${event.request.url} from cache!');
                return response;
            }

            // No, so return an outside fetch request for it (go to network)
            console.log(`Sorry, ${event.request.url} not found in cache`);
            return fetch(event.request).then(function(response) {
                if (response.status === 404) {
                    return caches.match('404.html');
                } else {
                    return response;
                }
            });
        }).catch(function(error) {
            console.log('Error', error);
            // this just returns offline.html for any resources not found. This needs
            // changing to include files like replacement images
            return caches.match('offline.html');
        })
    );
};


// Network, then cache falllback
const networkThenCache = (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
          return caches.match(event.request);
        })
    );
};

// Cache, then network and store in cache
const cacheThenNetworkAndStoreInCache = (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {

            // Did we find a match for this request in our caches?
            if(response){
                // Yes, return it from the cache
                console.log('Returning ${event.request.url} from cache!');
                return response;
            }

            // No, so return an outside fetch request for it (go to network)
            console.log('Sorry, ${event.request.url} not found in cache');

            return caches.open('${CACHE_NAME}-dynamic').then((cache) => {
                return fetch(event.request).then((response) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
        })
    );
}

// Intercept any network requests
self.addEventListener("fetch", function(event){
    
    //console.log("Service worker intercepting fetch event: ", event);
    
    if(event.request.url.startsWith('https://www.bing.com')){
        networkOnly(event);
        return;
    }
   cacheThenNetwork(event);
});



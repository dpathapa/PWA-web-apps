let dbPromise =idb.open('shared-reviews', 1, function(db){
    if(!db.objectStoreNames.contains('reviews')){
        db.createObjectStore('reviews', {keyPath: 'id'});
    }
    if(!db.objectStoreNames.contains('sync-reviews')){
        db.createObjectStore('sync-reviews', {keyPath: 'id'});
    }
});

function writeData(st, data){
    return dbPromise
    .then(function(db){
       let tx = db.transaction(st,'readwrite');
       let store = tx.objectStore(st);
       store.put(data); 
       return tx.complete;
    });
}
function readAllData(st){
    return dbPromise
    .then(function(db){
        let tx = db.transaction(st, 'readonly');
        let store = tx.objectStore(st);
        return store.getAll();
    });
}
function clearAllData(st){
    return dbPromise
    .then(function(db){
        let tx = db.transaction(st, 'readwrite');
        let store = tx.objectStore(st);
        store.clear();
        return tx.complete;
    });
}
function deleteItemFromData(st, id){
    return dbPromise
    .then(function(db){
       let tx = db.transaction(st,'readwrite');
       let store = tx.objectStore(st);
       store.delete(id); 
       return tx.complete;
    })
    .then(function(){
        console.log('Item deleted!');
    })
}
function dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ab], {type: mimeString});
    return blob;
  }
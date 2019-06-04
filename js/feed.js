let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let sharedMomentsArea = document.querySelector('#shared-moments');

let closerCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let locationInput = document.querySelector('#location');

let videoPlayer = document.querySelector('#player');
let canvasElement = document.querySelector('#canvas');
let captureButton = document.querySelector('#capture-btn');
let imagePicker = document.querySelector('#image-picker');
let imagePickerArea = document.querySelector('#pick-image');
let picture;

//polyfill
function initializeMedia(){
  if(!('mediaDevices' in navigator)){
    navigator.mediaDevices = {};
  }
  if(!('getUserMedia' in navigator.mediaDevices)){
    navigator.mediaDevices.getUserMedia = function(constraints){
      let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if(!getUserMedia){
        return Promise.reject(new Error('getUserMedia is not implemented!'));
      }
      return new Promise(function(resolve, reject){
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }
  navigator.mediaDevices.getUserMedia({video: true}) 
  .then(function(stream){
    videoPlayer.srcObject = stream;
    videoPlayer.style.display = 'block';
  })
  .catch(function(err){
    imagePickerArea.style.display = 'block';
  });
}
//capture image
captureButton.addEventListener('click',function(event){
  canvasElement.style.display = 'block';
  videoPlayer.style.display = 'none';
  captureButton.style.display = 'none';
  let context = canvasElement.getContext('2d');
  context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));
  videoPlayer.srcObject.getVideoTracks().forEach(function(track){
    track.stop();
  });
  picture = dataURItoBlob(canvasElement.toDataURL());
});

function openCreatePostModal(){
  // createPostArea.style.display = 'block';
  // setTimeout(function(){
    createPostArea.style.transform = 'translateY(0)';
    initializeMedia();
  // }, 1);

  if(deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal(){
   createPostArea.style.transform = 'translateY(100vh)';
   imagePickerArea.style.display = 'none';
   videoPlayer.style.display = 'none';
   canvasElement.style.display = 'none';
  //  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closerCreatePostModalButton.addEventListener('click',closeCreatePostModal);

// function onSaveButtonClicked(event){
//   console.log('clicked');
//   //cache user requested info
//   if('caches' in window){
//     caches.open('user-requested')
//     .then(function(cache){
//         cache.add('https://portfolio-deepa.firebaseio.com/reviews.json');
//     });
//   }
// }
function clearCards(){
  while(sharedMomentsArea.hasChildNodes()){
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

function createCard(data) {
  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  let cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url(' + data.image + ')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.backgroundPosition = 'center';

  cardWrapper.appendChild(cardTitle);
  let cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.location;

  cardTitle.appendChild(cardTitleTextElement);
  let cardLocation = document.createElement('div');
  cardLocation.className = 'mdl-card__supporting-text';
  cardLocation.textContent = data.location;
  cardLocation.style.textAlign = 'center';

  cardWrapper.appendChild(cardLocation);
  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.title;
  cardSupportingText.style.textAlign = 'center';

  // let cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);

  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data){
  clearCards();
  for (let i = 0; i < data.length; i++) {
  createCard(data[i]);
  }
}

let url = 'https://portfolio-deepa.firebaseio.com/reviews.json';
let networkDataReceived = false;

fetch(url) 
.then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    let dataArray = [];
    for (let key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('reviews')
  .then(function(data){
    if(!networkDataReceived){
      console.log('From cache', data);
      updateUI(data);
     }
  });
}

function sendData(){
    fetch('https://portfolio-deepa.firebaseio.com/reviews.json',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application.json'
    },
      body: JSON.stringify({
      id: new Date().toISOString(),
      title: titleInput.value,
      location: locationInput.value,
      image: 'https://firebasestorage.googleapis.com/v0/b/portfolio-deepa.appspot.com/o/Bungy.jpeg?alt=media&token=3f61b7aa-14ca-4ad3-9f1b-0c37469c7cea'
    })
  })
    .then(function(res){
      console.log('Sent data', res);
      updateUI();
    })  
  }


//form handler
form.addEventListener('submit', function(event) {
  event.preventDefault();

  if (titleInput.value.trim() === '' || locationInput.value.trim() === '') {
    alert('Please enter valid data!');
    return;
  }
  closeCreatePostModal();

  //if broweser doesn't support SW or syncManger
if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then(function(sw) {
          var review = {
            id: new Date().toISOString(),
            title: titleInput.value,
            location: locationInput.value,
          };
          writeData('sync-reviews', review)
            .then(function() {
              return sw.sync.register('sync-new-reviews');
            })
            .then(function() {
              var snackbarContainer = document.querySelector('#confirmation-toast');
              var data = {message: 'Your Post was saved for syncing!'};
              snackbarContainer.MaterialSnackbar.showSnackbar(data);
            })
            .catch(function(err) {
              console.log(err);
            });
          });
      } else {
      sendData();
    } 
  });

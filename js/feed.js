let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
// let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');

// function openCreatePostModal() {
//   createPostArea.style.display = 'block';
//   if (deferredPrompt) {
//     deferredPrompt.prompt();

//     deferredPrompt.userChoice.then(function(choiceResult) {
//       console.log(choiceResult.outcome);

//       if (choiceResult.outcome === 'dismissed') {
//         console.log('User cancelled installation');
//       } else {
//         console.log('User added to home screen');
//       }
//     });

//     deferredPrompt = null;
//   }
// }

// function closeCreatePostModal() {
//   createPostArea.style.display = 'none';
// }

// shareImageButton.addEventListener('click', openCreatePostModal);

// closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// function onSaveButtonClicked(event){
//   console.log('clicked');
//   if('caches' in window){
//     caches.open('user-requested')
//     .then(function(cache){
//       cache.add('https://httpbin.org/get');
//       cache.add('/image/Bungy.jpeg');
//     });
//   } 
// }

function createCard() {
  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  let cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("image/Bungy.jpeg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  // let cardTitleTextElement = document.createElement('h2');
  // cardTitleTextElement.className = 'mdl-card__title-text';
  // cardTitleTextElement.textContent = 'Nepal trip';
  // cardTitleTextElement.style.color = 'orange';
  // cardTitle.appendChild(cardTitleTextElement);
  let cardLocation = document.createElement('div');
  cardLocation.className = 'mdl-card__supporting-text';
  cardLocation.textContent = 'In Nepal';
  cardLocation.style.textAlign = 'center';
  cardWrapper.appendChild(cardLocation);
  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'Wonderful experiences! fun and scary at the same time :)';
  cardSupportingText.style.textAlign = 'center';

  // let cardSaveButton=document.createElement('button');
  // cardSaveButton.textContent= 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);

  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

fetch('https://httpbin.org/get')
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    createCard();
  });

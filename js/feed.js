let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
// let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');


function clearCards(){
  while (sharedMomentsArea.hasChildNodes()){
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
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  let cardLocation = document.createElement('div');
  cardLocation.className = 'mdl-card__supporting-text';
  cardLocation.textContent = data.location;
  cardLocation.style.textAlign = 'center';
  cardWrapper.appendChild(cardLocation);
  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.title;
  cardSupportingText.style.textAlign = 'center';

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
      dataArray.push(data[key])
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('reviews')
  .then(function(data){
    if(!networkDataReceived){
      console.log('From cache', data)
      updateUI(data);
     }
  });
}
 
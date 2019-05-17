var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var sharedMomentsArea = document.querySelector('#shared-moments');


function createCard(data) {
  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  let cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url(' + data.image + ')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.backgroundPosition = 'center';
  cardTitle.style.height = '400px';
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
  // componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data){
 
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
      console.log('From cache', data)
      updateUI(data);
     }
  });
}
// function sendData(){
//   fetch('https://portfolio-deepa.firebaseio.com/reviews.json',{
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application.json'
//   },
//     body: JSON.stringify({
//     id: new Date().toISOString(),
//     title: title.value,
//     location: location.value,
//     image: 'https://firebasestorage.googleapis.com/v0/b/portfolio-deepa.appspot.com/o/Bungy.jpeg?alt=media&token=3f61b7aa-14ca-4ad3-9f1b-0c37469c7cea'
//   })
//   .then(function(res){
//     console.log('Sent data', res);
//     updateUI();
//   })
// })
// };


// form.addEventListener('submit', function(event) {
//   event.preventDefault();

//   if (titleInput.value.trim() === '' || locationInput.value.trim() === '') {
//     alert('Please enter valid data!');
//     return;
//   }

 
//   if ('serviceWorker' in navigator && 'SyncManager' in window) {
//     navigator.serviceWorker.ready
//       .then(function(sw) {
//         var post = {
//           id: new Date().toISOString(),
//           title: titleInput.value,
//           location: locationInput.value,
//           picture: picture
//         };
//         writeData('sync-reviews', review)
//           .then(function() {
//             return sw.sync.register('sync-new-reviews');
//           })
//           .then(function() {
//             var snackbarContainer = document.querySelector('#confirmation-toast');
//             var data = {message: 'Your Post was saved for syncing!'};
//             snackbarContainer.MaterialSnackbar.showSnackbar(data);
//           })
//           .catch(function(err) {
//             console.log(err);
//           });
//       });
//   } else {
//     sendData();
//   }
// });



// //form handler
// //is browerse doesn't support SW or syncManger

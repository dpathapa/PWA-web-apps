// let config = {
//     apiKey: "AIzaSyB24uymq_gv68M2E32DSSviKMoPfonR0eM",
//     authDomain: "portfolio-deepa.firebaseapp.com",
//     databaseURL: "https://portfolio-deepa.firebaseio.com",
//     projectId: "portfolio-deepa",
//     storageBucket: "portfolio-deepa.appspot.com",
//     messagingSenderId: "43032017786"
//   };
//   firebase.initializeApp(config);
// //references
// let messagesRef = firebase.database().ref('messages');


// document.getElementById('reviewForm').addEventListener('submit', submitForm);

// //submit form
// function submitForm(e){
//     e.preventDefault();

//     //get values
//     // let image = getInputVal('image');
//     let location = getInputVal('location');
//     let title = getInputVal('title');

// //save message
//    // saveMessage(image,location,title);
//    saveMessage(location,title);

// //show alert
// document.querySelector('.alert').style.display ="block";

// //hide alert 3 sec
// setTimeout(function(){
//     document.querySelector('.alert').style.display ="none";

//  },3000);
// }

// //function to get from values
// function getInputVal(id){
//     return document.getElementById(id).value;
// }

// //save message
// function saveMessage(image,location,title){
//     let newMessageRef = messagesRef.push();
//     newMessageRef.set({
//         // image: image,
//         location: location,
//         title: title
//     });
// }
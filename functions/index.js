const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/*exports.userCreated = functions.auth.user().onCreate(user => {

  return admin.firestore().collection("account_info").doc(user.uid).set({
    name: '', address: '', city: '',
    state: '',zip: '', creditNo: '',
    photoURL: 'images/default_profile.jpg',
    });
})*/

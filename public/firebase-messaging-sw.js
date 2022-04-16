// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
// import { getMessaging,onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging.js";

importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');


// const firebaseApp = initializeApp({
//         apiKey: "AIzaSyAXT9zPMKtretOdqph7xCUS8oeMsNTcZAQ",
//         authDomain: "kanji-functions.firebaseapp.com",
//         projectId: "kanji-functions",
//         storageBucket: "kanji-functions.appspot.com",
//         messagingSenderId: "137802058635",
//         appId: "1:137802058635:web:2897b394fc76d73f79bd8e"
    
// });

firebase.initializeApp({
    apiKey: "AIzaSyAXT9zPMKtretOdqph7xCUS8oeMsNTcZAQ",
        authDomain: "kanji-functions.firebaseapp.com",
        projectId: "kanji-functions",
        storageBucket: "kanji-functions.appspot.com",
        messagingSenderId: "137802058635",
        appId: "1:137802058635:web:2897b394fc76d73f79bd8e"
  });

  const messaging = firebase.messaging();

// const messaging = getMessaging(firebaseApp);
// onBackgroundMessage(messaging, (payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = "New product";
    const notificationOptions = {
      body: 'New product in stock alert',
      icon: '/images/download.png'
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
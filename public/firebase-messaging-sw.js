importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

firebase.initializeApp({
      apiKey: "AIzaSyA2XXDR6gVSrdQZ8Po5temTgxUs31pCA6g",

      authDomain: "cmsc5373-sowmya-webapps.firebaseapp.com",

      projectId: "cmsc5373-sowmya-webapps",

      storageBucket: "cmsc5373-sowmya-webapps.appspot.com",

      messagingSenderId: "125768290355",

      appId: "1:125768290355:web:dfc65efa2688ee4fe39346",

      measurementId: "G-SVSNG7CTSY"
  });

  const messaging = firebase.messaging();


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
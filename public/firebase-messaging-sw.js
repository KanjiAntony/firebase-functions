importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

firebase.initializeApp({
      apiKey: "",

      authDomain: "kanji-functions.firebaseapp.com",

      projectId: "kanji-functions",

      storageBucket: "kanji-functions.appspot.com",

      messagingSenderId: "",

      appId: ""

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
window.onload = () => {
    'use strict';
    const pushButton = document.querySelector('#subscribeBtn');
    const depositButton = document.querySelector('#depositButton');
    const depositScreen = document.querySelector('#depositScreen');
    const subscriptionJson = document.querySelector('#subscriptionJson');
    const applicationServerPublicKey = 'BDNW8bT8KzNeEjbHdBu7zFjDKwB1JaEYYMzPqvAQnv6Dvtb532vapJB2-stqbjWCa7YRkYYQgLx1DNcpbGRNm-A';
    let isSubscribed = false;
    let swRegistration = null;
    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');
      
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
      
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }

    function initializeUI() {

        depositButton.addEventListener('click', function(){
            depositScreen.classList.toggle('removed');
            depositScreen.classList.contains('removed') ? depositButton.textContent='Remote Deposit' : depositButton.textContent = 'Done';
        })

        pushButton.addEventListener('click', function() {
            pushButton.disabled = true;
            if (isSubscribed) {
              unsubscribeUser();
            } else {
              subscribeUser();
            }
          });
        // Set the initial subscription value
        swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);
        
            if (isSubscribed) {
            console.log('User IS subscribed.');
            } else {
            console.log('User is NOT subscribed.');
            }
        
            updateBtn();
        });
    }

    function updateBtn() {
        if (isSubscribed) {
            pushButton.textContent = 'Stop Alerts';
        } else {
            pushButton.textContent = 'Receive Alerts';
        }
        
        pushButton.disabled = false;
    }

    function unsubscribeUser() {
        swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
          if (subscription) {
            return subscription.unsubscribe();
          }
        })
        .catch(function(error) {
          console.log('Error unsubscribing', error);
        })
        .then(function() {
          updateSubscriptionOnServer(null);
      
          console.log('User is unsubscribed.');
          isSubscribed = false;
      
          updateBtn();
        });
      }
    function subscribeUser() {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        })
        .then(function(subscription) {
          console.log('User is subscribed.');
          //Would update backend with the user'subscription - out of scope for demo
          updateSubscriptionOnServer(subscription);
            
          isSubscribed = true;
      
          updateBtn();
        })
        .catch(function(err) {
          console.log('Failed to subscribe the user: ', err);
          updateBtn();
        });
      }

      function updateSubscriptionOnServer(subscription) {
        console.log("subscription updated");
        subscriptionJson.textContent = JSON.stringify(subscription);
      }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('../sw.js').then(function(swReg) {
            console.log('Service Worker is registered', swReg);

            swRegistration = swReg;
            initializeUI();
        }).catch(function(error) {
            console.error('Service Worker Error', error);
        });
    }else {
        console.warn('Push messaging is not supported');
        pushButton.textContent = 'Push Not Supported';
    }
  }
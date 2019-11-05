'use strict';

let deferredInstallPrompt = null;
const installButton = document.getElementById('installBtn');
const engagementContainer = document.getElementById('engagement');
installButton.addEventListener('click', installPWA);

//event listener for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 *
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {
    deferredInstallPrompt = evt;
    engagementContainer.classList.toggle('hidden');
    engagementContainer.classList.toggle('visible');
}


/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
function installPWA(evt) {
  deferredInstallPrompt.prompt();
  engagementContainer.classList.toggle('hidden');
  engagementContainer.classList.toggle('visible');


}

window.addEventListener('appinstalled', logAppInstalled);

/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */
function logAppInstalled(evt) {
    console.log("App Installed!");

}
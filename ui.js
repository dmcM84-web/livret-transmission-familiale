/* ==========================================================
   LIVRET DE TRANSMISSION FAMILIALE
   ui.js
========================================================== */

function notifier(message, type = "success") {

    let toast = document.getElementById("toastNotification");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toastNotification";

        toast.className =
            "position-fixed bottom-0 start-50 translate-middle-x mb-4";

        toast.style.zIndex = "3000";

        document.body.appendChild(toast);

    }

    toast.innerHTML = `
        <div class="alert alert-${type} shadow-lg">
            ${message}
        </div>
    `;

    setTimeout(() => {

        toast.innerHTML = "";

    }, 2500);

}



/* ==========================================================
   INDICATEUR DE SAUVEGARDE
========================================================== */

function afficherSauvegarde() {

    const zone = document.getElementById("saveStatus");

    if (!zone) return;

    const maintenant = new Date();

    zone.innerHTML =
        "💾 Dernière sauvegarde : " +
        maintenant.toLocaleTimeString("fr-FR");

}



/* ==========================================================
   CONFIRMATION EXPORT
========================================================== */

function confirmationExport() {

    notifier(

        "Le PDF est en cours de génération…",

        "info"

    );

}



/* ==========================================================
   INITIALISATION
========================================================== */

window.addEventListener("load", () => {

    notifier(

        "Bienvenue dans votre livret de transmission familiale.",

        "primary"

    );

});

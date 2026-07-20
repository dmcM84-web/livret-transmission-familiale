const STORAGE_KEY = "livret";const AUTO_SAVE_DELAY = 2000;

let autoSaveTimer = null;

/* ==========================================================AUTO SAUVEGARDE========================================================== */

function demarrerSauvegardeAutomatique() {

document.addEventListener("input", () => {

    clearTimeout(autoSaveTimer);

    autoSaveTimer = setTimeout(() => {

        sauvegarderToutesLesReponses();

    }, AUTO_SAVE_DELAY);

});

}



/* ==========================================================SAUVEGARDE COMPLETE========================================================== */

function sauvegarderToutesLesReponses() {

const donnees = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "{}"
);

document
    .querySelectorAll("textarea,input")
    .forEach(champ => {

        donnees[champ.id] = champ.value;

    });

localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(donnees)
);

localStorage.setItem(
    "derniereSauvegarde",
    new Date().toLocaleString("fr-FR")
);

afficherEtatSauvegarde();

}



/* ==========================================================RESTAURATION========================================================== */

function restaurerToutesLesReponses() {

const donnees = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "{}"
);

document
    .querySelectorAll("textarea,input")
    .forEach(champ => {

        if (donnees[champ.id] !== undefined) {

            champ.value = donnees[champ.id];

            champ.dispatchEvent(
                new Event("input")
            );

        }

    });

}



/* ==========================================================ETAT DE SAUVEGARDE========================================================== */

function afficherEtatSauvegarde() {

const zone = document.getElementById("saveStatus");

if (!zone) return;

const date = localStorage.getItem(
    "derniereSauvegarde"
);

zone.innerHTML =

    "💾 Sauvegardé automatiquement"

    +

    (date ? " • " + date : "");

}



/* ==========================================================EXPORT JSON========================================================== */

function exporterJSON() {

sauvegarderToutesLesReponses();

const donnees = {

    version:1,

    date:new Date().toISOString(),

    chapitre:
        localStorage.getItem("chapitreCourant"),

    reponses:
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
            || "{}"
        )

};

const blob = new Blob(

    [JSON.stringify(donnees,null,2)],

    {type:"application/json"}

);

const lien = document.createElement("a");

lien.href = URL.createObjectURL(blob);

lien.download =

    "Livret-Transmission-"

    +

    new Date().toISOString().substring(0,10)

    +

    ".json";

lien.click();

}



/* ==========================================================IMPORT JSON========================================================== */

function importerJSON(fichier) {

const lecteur = new FileReader();

lecteur.onload = e => {

    try{

        const donnees = JSON.parse(
            e.target.result
        );

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(
                donnees.reponses || {}
            )

        );

        localStorage.setItem(

            "chapitreCourant",

            donnees.chapitre || 0

        );

        location.reload();

    }

    catch{

        alert(
            "Le fichier sélectionné est invalide."
        );

    }

};

lecteur.readAsText(fichier);

}



/* ==========================================================REMISE A ZERO========================================================== */

function viderLivret(){

if(

    !confirm(

        "Supprimer définitivement toutes les réponses ?"

    )

){

    return;

}

Object.keys(localStorage).forEach(cle=>{

    if(

        cle===STORAGE_KEY ||

        cle==="chapitreCourant" ||

        cle==="derniereSauvegarde" ||

        cle.startsWith("fichiers_")

    ){

        localStorage.removeItem(cle);

    }

});

location.reload();

}



/* ==========================================================PROTECTION FERMETURE========================================================== */

window.addEventListener(
"beforeunload",
()=>{

    try{

        sauvegarderToutesLesReponses();

    }

    catch(e){

        console.log(e);

    }

}
);


/* ==========================================================INITIALISATION========================================================== */

window.addEventListener(

"load",

()=>{

    demarrerSauvegardeAutomatique();

    afficherEtatSauvegarde();

}

);

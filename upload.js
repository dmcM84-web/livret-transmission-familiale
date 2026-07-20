document.addEventListener("dragover", e => {
    e.preventDefault();
});

document.addEventListener("drop", e => {
    e.preventDefault();
});



/* ==========================================================
   INITIALISATION
========================================================== */

function initialiserUpload() {

    document
        .querySelectorAll('input[type="file"]')
        .forEach(input => {

            input.addEventListener(
                "change",
                traiterSelection
            );

            creerZoneDepot(input);

        });

}



/* ==========================================================
   DEPOT PAR GLISSER / DEPOSER
========================================================== */

function creerZoneDepot(input) {

    const zone = document.createElement("div");

    zone.className = "drop-zone mt-3";

    zone.innerHTML =

        "<strong>Déposez vos fichiers ici</strong><br>ou cliquez sur le bouton ci-dessus.";

    input.parentNode.insertBefore(
        zone,
        input.nextSibling
    );

    zone.addEventListener("dragover", e => {

        e.preventDefault();

        zone.classList.add("drag");

    });

    zone.addEventListener("dragleave", () => {

        zone.classList.remove("drag");

    });

    zone.addEventListener("drop", e => {

        e.preventDefault();

        zone.classList.remove("drag");

        input.files = e.dataTransfer.files;

        traiterSelection({

            target: input

        });

    });

}
/* ==========================================================
   TRAITEMENT DES FICHIERS
========================================================== */

function traiterSelection(e) {

    const input = e.target;

    if (!input.files.length) return;

    Array.from(input.files).forEach(fichier => {

        if (fichier.size > 20 * 1024 * 1024) {

            alert(

                fichier.name +

                " dépasse la taille maximale de 20 Mo."

            );

            return;

        }

        enregistrerFichier(

            input.id,

            fichier

        );

    });

}
/* ==========================================================
   ENREGISTREMENT
========================================================== */

function enregistrerFichier(id, fichier) {

    const lecteur = new FileReader();

    lecteur.onload = e => {

        const liste = JSON.parse(

            localStorage.getItem(

                "fichiers_" + id

            ) || "[]"

        );

        liste.push({

            nom: fichier.name,

            type: fichier.type,

            taille: fichier.size,

            date: new Date().toISOString(),

            contenu: e.target.result

        });

        localStorage.setItem(

            "fichiers_" + id,

            JSON.stringify(liste)

        );

        afficherPiecesJointes(id);

    };

    lecteur.readAsDataURL(fichier);

}
/* ==========================================================
   APERCU DES IMAGES
========================================================== */

function creerApercuImage(dataURL) {

    const img = document.createElement("img");

    img.src = dataURL;

    img.className = "img-fluid rounded shadow";

    img.style.maxHeight = "180px";

    return img;

}


/* ==========================================================
   GESTION DES PHOTOS
========================================================== */

const photosLivret = {};
const sauvegardePhotos=

JSON.parse(

localStorage.getItem("photosLivret")

|| "{}"

);

Object.assign(

photosLivret,

sauvegardePhotos

);
/* ==========================================================
   DEMARRAGE
========================================================== */

window.addEventListener("load", () => {

    initialiserUpload();

    Object.keys(photosLivret).forEach(chapitre => {

        afficherPhotos(chapitre);

    });

});

function ajouterPhoto(chapitre, input) {

    if (!input.files.length) return;

    if (!photosLivret[chapitre]) {

        photosLivret[chapitre] = [];

    }

    Array.from(input.files).forEach(fichier => {

        const lecteur = new FileReader();

        lecteur.onload = e => {

            photosLivret[chapitre].push({

                nom: fichier.name,

                image: e.target.result

            });

            afficherPhotos(chapitre);
localStorage.setItem(

    "photosLivret",

    JSON.stringify(photosLivret)

);
        };

        lecteur.readAsDataURL(fichier);

    });

}



function afficherPhotos(chapitre) {

    const zone = document.getElementById(

        "photos-" + chapitre

    );

    if (!zone) return;

    zone.innerHTML = "";

    if (!photosLivret[chapitre]) return;

    photosLivret[chapitre].forEach(photo => {

        zone.innerHTML += `

        <img

            src="${photo.image}"

            class="img-thumbnail m-2"

            style="width:150px;height:150px;object-fit:cover;">

        `;

    });

}
/* ==========================================================
   AFFICHAGE DES PIECES JOINTES
========================================================== */

function afficherPiecesJointes(id){

    const zone=document.getElementById("pieces-"+id);

    if(!zone) return;

    zone.innerHTML="";

    const liste=JSON.parse(

        localStorage.getItem("fichiers_"+id)

        || "[]"

    );

    liste.forEach(fichier=>{

        const ligne=document.createElement("div");

        ligne.className="piece-jointe";

        ligne.innerHTML=`

            📎 ${fichier.nom}

            <small class="text-muted">

            (${Math.round(fichier.taille/1024)} Ko)

            </small>

        `;

        zone.appendChild(ligne);

    });

}

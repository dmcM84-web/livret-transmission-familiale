/* ==========================================================
   LIVRET DE TRANSMISSION FAMILIALE
   app.js
========================================================== */

let chapitreCourant = 0;

const contenu = document.getElementById("content");
const menu = document.getElementById("chapters");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");



/* ==========================================================
   INITIALISATION
========================================================== */

window.addEventListener("load", () => {

    construireMenu();

    restaurerDernierChapitre();

    afficherChapitre(chapitreCourant);

    mettreAJourProgression();

});



/* ==========================================================
   MENU
========================================================== */

function construireMenu() {

    menu.innerHTML = "";

    livret.forEach((chapitre, index) => {

        const bouton = document.createElement("button");

        bouton.className = "list-group-item list-group-item-action";

        bouton.innerHTML = chapitre.titre;

        bouton.onclick = () => {

            sauvegarderChapitre();

            chapitreCourant = index;

            localStorage.setItem(
                "chapitreCourant",
                index
            );

            afficherChapitre(index);

        };

        menu.appendChild(bouton);

    });

}



function restaurerDernierChapitre() {

    const sauvegarde = localStorage.getItem("chapitreCourant");

    if (sauvegarde !== null) {

        chapitreCourant = Number(sauvegarde);

    }

}



/* ==========================================================
   AFFICHAGE
========================================================== */

function afficherChapitre(index) {

    const chapitre = livret[index];

    contenu.innerHTML = "";



    document
        .querySelectorAll("#chapters button")
        .forEach((b, i) => {

            b.classList.toggle(
                "active",
                i === index
            );

        });



    const titre = document.createElement("h2");

    titre.className = "mb-3";

    titre.textContent = chapitre.titre;

    contenu.appendChild(titre);



    if (chapitre.description) {

        const description = document.createElement("p");

        description.className = "text-muted mb-4";

        description.textContent = chapitre.description;

        contenu.appendChild(description);

    }



    chapitre.questions.forEach(question => {

        contenu.appendChild(
            creerChamp(question)
        );

    });



    const navigation = document.createElement("div");

    navigation.className =
        "d-flex justify-content-between mt-5";



    const precedent = document.createElement("button");

    precedent.className =
        "btn btn-outline-secondary";

    precedent.innerHTML = "← Chapitre précédent";



    precedent.disabled = index === 0;



    precedent.onclick = () => {

        sauvegarderChapitre();

        chapitreCourant--;

        localStorage.setItem(
            "chapitreCourant",
            chapitreCourant
        );

        afficherChapitre(chapitreCourant);

    };



    const suivant = document.createElement("button");

    suivant.className =
        "btn btn-primary";

    suivant.innerHTML =
        index === livret.length - 1
        ? "Terminer"
        : "Chapitre suivant →";



    suivant.onclick = () => {

        sauvegarderChapitre();

        if (chapitreCourant < livret.length - 1) {

            chapitreCourant++;

            localStorage.setItem(
                "chapitreCourant",
                chapitreCourant
            );

            afficherChapitre(
                chapitreCourant
            );

        }

    };



    navigation.appendChild(precedent);

    navigation.appendChild(suivant);

    contenu.appendChild(navigation);

}
/* ==========================================================
   CREATION DES CHAMPS
========================================================== */

function creerChamp(question) {

    const bloc = document.createElement("div");
    bloc.className = "card shadow-sm mb-4";

    const body = document.createElement("div");
    body.className = "card-body";

    const label = document.createElement("label");
    label.className = "form-label fw-bold";
    label.textContent = question.label;

    body.appendChild(label);

    let champ;

    switch (question.type) {

        case "file":

            champ = document.createElement("input");
            champ.type = "file";
            champ.className = "form-control";
            champ.multiple = true;

            break;

        default:

            champ = document.createElement("textarea");

            champ.className = "form-control";

            champ.rows = 4;

            champ.placeholder = "Écrivez votre réponse...";

            champ.style.resize = "none";

            champ.addEventListener("input", autoResize);

            break;

    }

    champ.id = question.id;

    chargerValeur(champ);

    champ.addEventListener("change", sauvegarderChamp);

    champ.addEventListener("input", sauvegarderChamp);

    body.appendChild(champ);

    if (question.type === "file") {

        const liste = document.createElement("div");

        liste.id = question.id + "_liste";

        liste.className = "mt-3";

        body.appendChild(liste);

        afficherPiecesJointes(question.id);

    }

    bloc.appendChild(body);

    return bloc;

}



/* ==========================================================
   AUTO RESIZE
========================================================== */

function autoResize(e) {

    e.target.style.height = "auto";

    e.target.style.height =
        e.target.scrollHeight + "px";

}



/* ==========================================================
   CHARGEMENT
========================================================== */

function chargerValeur(champ) {

    const sauvegarde =
        JSON.parse(
            localStorage.getItem("livret")
            || "{}"
        );

    if (
        champ.type !== "file" &&
        sauvegarde[champ.id]
    ) {

        champ.value =
            sauvegarde[champ.id];

        champ.dispatchEvent(
            new Event("input")
        );

    }

}



/* ==========================================================
   SAUVEGARDE D'UN CHAMP
========================================================== */

function sauvegarderChamp(e) {

    const champ = e.target;

    const sauvegarde =
        JSON.parse(
            localStorage.getItem("livret")
            || "{}"
        );



    if (champ.type === "file") {

        sauvegarderFichiers(champ);

        return;

    }



    sauvegarde[champ.id] = champ.value;

    localStorage.setItem(
        "livret",
        JSON.stringify(sauvegarde)
    );



    mettreAJourProgression();

}



/* ==========================================================
   SAUVEGARDE GENERALE
========================================================== */

function sauvegarderChapitre() {

    document
        .querySelectorAll("textarea")
        .forEach(champ => {

            const sauvegarde =
                JSON.parse(
                    localStorage.getItem("livret")
                    || "{}"
                );

            sauvegarde[champ.id] = champ.value;

            localStorage.setItem(
                "livret",
                JSON.stringify(sauvegarde)
            );

        });

}
/* ==========================================================
   PIECES JOINTES
========================================================== */

function sauvegarderFichiers(input) {

    if (!input.files.length) return;

    const cle = "fichiers_" + input.id;

    const sauvegarde = JSON.parse(
        localStorage.getItem(cle) || "[]"
    );

    Array.from(input.files).forEach(fichier => {

        const lecteur = new FileReader();

        lecteur.onload = function (e) {

            sauvegarde.push({

                nom: fichier.name,
                type: fichier.type,
                taille: fichier.size,
                contenu: e.target.result

            });

            localStorage.setItem(
                cle,
                JSON.stringify(sauvegarde)
            );

            afficherPiecesJointes(input.id);

        };

        lecteur.readAsDataURL(fichier);

    });

}



/* ==========================================================
   AFFICHAGE DES PIECES JOINTES
========================================================== */

function afficherPiecesJointes(id) {

    const zone = document.getElementById(id + "_liste");

    if (!zone) return;

    zone.innerHTML = "";

    const fichiers = JSON.parse(
        localStorage.getItem("fichiers_" + id) || "[]"
    );

    fichiers.forEach((fichier, index) => {

        const carte = document.createElement("div");

        carte.className =
            "border rounded p-3 mb-3 bg-light";



        if (fichier.type.startsWith("image/")) {

            const image = document.createElement("img");

            image.src = fichier.contenu;

            image.className = "img-fluid rounded mb-2";

            carte.appendChild(image);

        }



        const nom = document.createElement("div");

        nom.className = "fw-bold";

        nom.textContent = fichier.nom;

        carte.appendChild(nom);



        const supprimer = document.createElement("button");

        supprimer.className =
            "btn btn-sm btn-danger mt-2";

        supprimer.textContent = "Supprimer";



        supprimer.onclick = () => {

            fichiers.splice(index, 1);

            localStorage.setItem(

                "fichiers_" + id,

                JSON.stringify(fichiers)

            );

            afficherPiecesJointes(id);

        };



        carte.appendChild(supprimer);

        zone.appendChild(carte);

    });

}



/* ==========================================================
   PROGRESSION
========================================================== */

function mettreAJourProgression() {

    const donnees = JSON.parse(
        localStorage.getItem("livret") || "{}"
    );

    let total = 0;
    let remplies = 0;

    livret.forEach(chapitre => {

        chapitre.questions.forEach(question => {

            if (question.type === "textarea") {

                total++;

                if (
                    donnees[question.id] &&
                    donnees[question.id].trim() !== ""
                ) {

                    remplies++;

                }

            }

        });

    });

    const pourcentage = total === 0
        ? 0
        : Math.round(remplies * 100 / total);

    if (progressBar) {

        progressBar.style.width =
            pourcentage + "%";

        progressBar.textContent =
            pourcentage + "%";

    }

    if (progressText) {

        progressText.textContent =
            remplies +
            " réponses sur " +
            total;

    }

}



/* ==========================================================
   EXPORT JSON
========================================================== */

function exporterSauvegarde() {

    const donnees = {

        livret: JSON.parse(
            localStorage.getItem("livret") || "{}"
        ),

        chapitre:
            localStorage.getItem("chapitreCourant"),

        date:
            new Date().toISOString()

    };

    const blob = new Blob(

        [JSON.stringify(donnees, null, 2)],

        { type: "application/json" }

    );

    const lien = document.createElement("a");

    lien.href = URL.createObjectURL(blob);

    lien.download = "livret-transmission.json";

    lien.click();

}



/* ==========================================================
   IMPORT JSON
========================================================== */

function importerSauvegarde(fichier) {

    const lecteur = new FileReader();

    lecteur.onload = function (e) {

        const donnees = JSON.parse(e.target.result);

        localStorage.setItem(
            "livret",
            JSON.stringify(donnees.livret || {})
        );

        localStorage.setItem(
            "chapitreCourant",
            donnees.chapitre || 0
        );

        location.reload();

    };

    lecteur.readAsText(fichier);

}



/* ==========================================================
   REINITIALISATION
========================================================== */

function reinitialiserLivret() {

    if (!confirm(
        "Voulez-vous vraiment supprimer toutes les réponses ?"
    )) {

        return;

    }

    Object.keys(localStorage).forEach(cle => {

        if (

            cle === "livret" ||

            cle === "chapitreCourant" ||

            cle.startsWith("fichiers_")

        ) {

            localStorage.removeItem(cle);

        }

    });

    location.reload();

}

/* ==========================================================
   PROGRESSION DU LIVRET
========================================================== */

function mettreAJourProgression() {

    const champs = document.querySelectorAll(
        "textarea, input[type='text'], input[type='date'], input[type='email'], input[type='tel']"
    );

    if (champs.length === 0) return;

    let remplis = 0;

    champs.forEach(champ => {

        if (champ.value.trim() !== "") {

            remplis++;

        }

    });

    const pourcentage = Math.round(
        (remplis / champs.length) * 100
    );

    const barre = document.getElementById("progressBar");

    if (barre) {

        barre.style.width = pourcentage + "%";

        barre.innerHTML = pourcentage + "%";

    }

    const texte = document.getElementById("progressText");

    if (texte) {

        texte.innerHTML =
            remplis +
            " / " +
            champs.length +
            " réponses";

    }

}



/* ==========================================================
   SUIVI AUTOMATIQUE
========================================================== */

function activerProgression() {

    document.addEventListener("input", () => {

        mettreAJourProgression();

    });

}



/* ==========================================================
   INITIALISATION
========================================================== */

window.addEventListener("load", () => {

    mettreAJourProgression();

    activerProgression();

    mettreAJourSommaire();

});

/* ==========================================================
   ETAT DES CHAPITRES
========================================================== */

function mettreAJourSommaire() {

    const boutons = document.querySelectorAll("#chapters a");

    boutons.forEach((bouton, index) => {

        bouton.classList.remove("active");

        bouton.innerHTML =
            "⚪ " + chapitres[index];

    });

    if (typeof chapitreCourant !== "undefined") {

        boutons[chapitreCourant].classList.add("active");

    }

    boutons.forEach((bouton, index) => {

        const section = document.querySelector(
            `[data-chapitre="${index}"]`
        );

        if (!section) return;

        const champs = section.querySelectorAll(
            "textarea,input"
        );

        if (champs.length === 0) return;

        let remplis = 0;

        champs.forEach(champ => {

            if (champ.value.trim() !== "") {

                remplis++;

            }

        });

        if (remplis === 0) {

            bouton.innerHTML =
                "⚪ " + chapitres[index];

        }

        else if (remplis < champs.length) {

            bouton.innerHTML =
                "🟡 " + chapitres[index];

        }

        else {

            bouton.innerHTML =
                "🟢 " + chapitres[index];

        }

    });

}

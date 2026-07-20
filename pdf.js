async function exporterPDF() {

const { jsPDF } = window.jspdf;

const pdf = new jsPDF({

    orientation: "portrait",

    unit: "mm",

    format: "a4"

});
try{

    const logo=document.getElementById("logoPDF");

    if(logo){

        pdf.addImage(

            logo,

            "PNG",

            80,

            15,

            50,

            50

        );

    }

}

catch(e){}

const marge = 20;

const largeur = 170;

let y = 25;



pdf.setFont("helvetica", "bold");

pdf.setFontSize(22);

pdf.text(

    "Mon histoire, mes souvenirs, ma vie",

    105,

    y,

    { align: "center" }

);



y += 12;

pdf.setFontSize(16);

pdf.text(

    "Livret de transmission familiale",

    105,

    y,

    { align: "center" }

);



y += 20;

pdf.setFontSize(10);

pdf.setFont("helvetica", "normal");

pdf.text(

    "Généré le " + new Date().toLocaleDateString("fr-FR"),

    105,

    y,

    { align: "center" }

);



pdf.addPage();

y = 20;

const reponses = JSON.parse(

    localStorage.getItem("livret") || "{}"

);

livret.forEach(chapitre => {

    if (y > 250) {

        pdf.addPage();

        y = 20;

    }

    pdf.setFontSize(18);

    pdf.setFont("helvetica", "bold");

    pdf.text(

        chapitre.titre,

        marge,

        y

    );

    y += 10;
            chapitre.questions.forEach(question => {

            if (question.type === "file") return;

            const reponse = reponses[question.id] || "";

            if (y > 260) {

                pdf.addPage();

                y = 20;

            }

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(11);

            const questionTexte = pdf.splitTextToSize(
                question.label,
                largeur
            );

            pdf.text(
                questionTexte,
                marge,
                y
            );

            y += questionTexte.length * 5;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);

            const texte = reponse.trim() === ""
                ? "(Aucune réponse)"
                : reponse;

            const lignes = pdf.splitTextToSize(
                texte,
                largeur
            );

            lignes.forEach(ligne => {

                if (y > 280) {

                    pdf.addPage();

                    y = 20;

                }

                pdf.text(
                    ligne,
                    marge + 5,
                    y
                );

                y += 5;

            });

            y += 6;

        });

        y += 8;

    });
/* ==========================================================
   AJOUT DES PHOTOS
========================================================== */

livret.forEach(chapitre => {

    chapitre.questions.forEach(question => {

        if (question.type !== "file") return;

        const fichiers = JSON.parse(
            localStorage.getItem(
                "fichiers_" + question.id
            ) || "[]"
        );

        if (fichiers.length === 0) return;

        if (y > 230) {
            pdf.addPage();
            y = 20;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);

        pdf.text(
            "Documents et photos",
            marge,
            y
        );

        y += 10;

        fichiers.forEach(fichier => {

            if (y > 220) {
                pdf.addPage();
                y = 20;
            }

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10);

            pdf.text(
                fichier.nom,
                marge,
                y
            );

            y += 5;

            if (
                fichier.type &&
                fichier.type.startsWith("image/")
            ) {

                try {

                    const format = fichier.type.includes("png")
                        ? "PNG"
                        : "JPEG";

                    pdf.addImage(
                        fichier.contenu,
                        format,
                        marge,
                        y,
                        70,
                        50
                    );

                    y += 55;

                } catch {

                    pdf.setFont("helvetica", "italic");

                    pdf.text(
                        "(Image non exportable)",
                        marge,
                        y
                    );

                    y += 8;

                }

            } else {

                pdf.setFont("helvetica", "normal");

                pdf.text(
                    "Document joint : " + fichier.nom,
                    marge,
                    y
                );

                y += 8;

            }

        });

    });

});
    /* ==========================================================
       INFORMATIONS FINALES
    ========================================================== */

    if (y > 245) {

        pdf.addPage();

        y = 20;

    }

    pdf.setDrawColor(176, 139, 58);
    pdf.line(marge, y, 190, y);

    y += 10;

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(10);

    pdf.text(
        "Merci d'avoir partagé votre histoire.",
        105,
        y,
        { align: "center" }
    );

    y += 8;

    pdf.text(
        "Ce livret a été créé pour transmettre vos souvenirs aux générations futures.",
        105,
        y,
        { align: "center" }
    );



    /* ==========================================================
       NUMEROTATION DES PAGES
    ========================================================== */

    const pages = pdf.getNumberOfPages();

    for (let i = 1; i <= pages; i++) {

        pdf.setPage(i);

        pdf.setFont("helvetica", "normal");

        pdf.setFontSize(9);

        pdf.text(
            "Page " + i + " / " + pages,
            105,
            290,
            { align: "center" }
        );

    }



    /* ==========================================================
       METADONNEES
    ========================================================== */

    pdf.setProperties({

        title: "Livret de transmission familiale",

        subject: "Mémoire familiale",

        author: "Application Livret de transmission",

        creator: "Marilou DEMOUCRON",

        keywords: "famille,souvenirs,mémoire,histoire",

        producer:"Version 1.0"
    });



    /* ==========================================================
       SAUVEGARDE
    ========================================================== */

    const date = new Date();
    const nomFichier =
        "Livret_Transmission_" +
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0") +
        ".pdf";
// pdf.output("dataurlnewwindow");
    pdf.save(nomFichier);
};

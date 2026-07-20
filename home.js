/* ==========================================================
   PAGE D'ACCUEIL
========================================================== */

function afficherAccueil(){

    const contenu=document.getElementById("content");

    contenu.innerHTML=`

<div class="cover">

<div class="cover-card">

<div class="cover-image"></div>

<div class="cover-body">

<h1>Mon histoire</h1>

<h2>Mes souvenirs, ma vie</h2>

<p>

Parce qu'une histoire familiale mérite
d'être transmise.

</p>

<div class="cover-footer">

<button
class="btn btn-lg btn-primary"
onclick="commencerLivret()">

Commencer le livret

</button>

</div>

</div>

</div>

</div>

`;

}

function commencerLivret(){

    chapitreCourant=0;

    afficherChapitre();

}

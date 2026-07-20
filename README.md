<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Livret de Transmission Familiale</title>

    <link rel="stylesheet" href="css/style.css">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>

<header class="hero">

    <div class="container text-center">

        <h1>Livret de Transmission Familiale</h1>

        <p class="lead">
            Transmettre son histoire, ses souvenirs et ses valeurs.
        </p>

        <a href="pages/accueil.html" class="btn btn-primary btn-lg">
            Commencer le livret
        </a>

    </div>

</header>

</body>

</html>
# livret-transmission-familiale:root{

--bleu:#235789;
--vert:#2A9D8F;
--beige:#F8F5F0;
--gris:#555;

}

body{

margin:0;
font-family:Arial, Helvetica, sans-serif;
background:var(--beige);

}

.hero{

min-height:100vh;

display:flex;

justify-content:center;

align-items:center;

background:linear-gradient(135deg,#235789,#2A9D8F);

color:white;

text-align:center;

padding:40px;

}

.hero h1{

font-size:4rem;

font-weight:bold;

margin-bottom:20px;

}

.hero p{

font-size:1.3rem;

margin-bottom:40px;

}

.btn-primary{

background:white;

color:#235789;

border:none;

padding:15px 35px;

font-size:1.2rem;

border-radius:50px;

font-weight:bold;

}

.btn-primary:hover{

background:#F3F3F3;

color:#235789;

}

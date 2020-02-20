// Afin de gérer au mieux notre environnement et de permettre a notre application/serveur d'avoir une meilleur portabilité
// On inclu le module dotenv qui nous permet de définir différentes variable d'environnement
const dotenv = require('dotenv');
dotenv.config();

// on ajoute à notre projet les modules nécessaires à son fonctionnement
// On ajoute le module path
const path = require('path');

// Ici express
const express = require('express');

// On initialise notre application express
const app = express();

const session = require('express-session');

// Notre router
const router = require(path.join(__dirname, 'app', 'router'));

// Notre module de logging
const logger = require(path.join(__dirname, 'app', 'logger'));
logger.debug(`Chargement du module logger`);

// Configuration de notre moteur de template eJS
app.set('view engine', 'ejs');

// Le fait d'utiliser path.join() et dirname nous assure que le repertoire des vues sera toujours trouvé, quelque soit l'environnement d'éxecution du script. Il rajoute également le trailing slash (slash de fin de répertoire)

// Sur un système utilisant les / (slash) comme séparateur de répertoire
// app.set('views', 'app/views/'); en relatif
// app.set('views', '/Users/yann/Sites/oClock/Zenith/s4/Trombin-o-clock-zenith/app/views/') en absolu

// Sur un système utilisant les \ (anti-slash) comme séparateur de répertoire
// app.set('views', 'app\views\'); en relatif
// app.set('views', '\Users\yann\Sites\oClock\Zenith\s4\Trombin-o-clock-zenith\app\views\') en absolu

// Ici plus besoin de s'embêter
app.set('views', path.join(__dirname, 'app', 'views'));

// On ajoute le middleware chargé de gérer les fichiers statiques
app.use(express.static(path.join(__dirname, 'assets')));

// C'est notre middleware de gestion des sessions
app.use(session({
  secret: 'ma phrase de securisation',
  resave: true,
  saveUninitialized: true
}));

// Middleware perso 
app.use((request, response, next) => {

  if (!request.session.history) {
    request.session.history = [];
  }
  request.session.history.push(request.url);

  response.locals.session = request.session;
  next();
});

// On utilise notre propre middleware de routage
app.use(router);

// Maintenant que l'on utilise dotenv on peut définir des variables d'environnement : ici notre port d'écoute
const PORT = process.env.PORT || 4000;
// On met le serveur en écoute sur un port spécifique
app.listen(PORT, () => {
  logger.debug(`listening on port ${PORT}`);
});
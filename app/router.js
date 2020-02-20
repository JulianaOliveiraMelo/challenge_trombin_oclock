const path = require('path');
const express = require('express');
const router = express.Router();
const mainController = require(path.join(__dirname, 'controller','main.js'));
const promoController = require(path.join(__dirname, 'controller','promo.js'));
const studentController = require(path.join(__dirname, 'controller', 'student.js'));
const profController = require(path.join(__dirname, 'controller', 'prof.js'));

// Afin de récupérer les données envoyés en POST on doit utiliser le middleware dédié d'express
router.use(express.urlencoded({extended: true}));

// Je demande au router que lorsqu'on lui demande la racine du serveur, d'utiliser la méthode homePage du controller "mainController", il va lui envoyer de façon automatique l'objet de requête (request) et l'objet de réponse (response)

// Route de la page d'accueil
router.get('/', mainController.homePage);
// Route pour une connexion utilisateur
router.get('/login', mainController.loginPage);
router.post('/login', mainController.loginPage);
// Route de la page de contact
router.get('/contact', mainController.contactPage);
// Route de la page listant les différentes promos
router.get('/promos', promoController.promoList);
// Route de la page listant les étudiants d'une promo en particulier
router.get('/promo/:id/student', studentController.studentList);
// Route de la page listant les profs d'une promo en particulier
router.get('/promo/:id/prof', profController.profList);
// Afin de pouvoir récupérer les informations qui ont été envoyé en POST
// Il faut créer une route qui est chargé de capturer la méthode de requête
router.post('/promo/:id/edit', promoController.promoUpdate);
// Notre nouvelle route pour éditer une promo contien un paramètre dynamique entre 2 segments fixes
router.get('/promo/:id/edit', promoController.promoEdit);
// Route de la page affichant le détail d'une promo
router.get('/promo/:id/:name', promoController.promo);
// Route de la page affichant le détail d'un étudiant
router.get('/student/:id', studentController.student);
// Route de la page affichant le détail d'un prof
router.get('/prof/:id', profController.prof);
//Route permettant de récupérer les données de l'étudiant envoyés en POST
router.post('/student/:id/edit', studentController.studentUpdate);
//Route pour éditer un étudiant
router.get('/student/:id/edit', studentController.studentEdit);

/*
/1erElement/2emeElement/:1erParam/3emeElement/:2emeParam
Express va découper et traiter une une partie après l'autre

1erElement 
Si l'url commence par 1erElement alors il continue a traiter et vérifier la route

2emeElement 
Si l'url continue avec JeNeSuisPasLe2emeElement alors il s'arrête et procède a une autre route potentiel défini après.
Si cela correcpond il continue

1erParam
Si le l'url contient quelque chose, quelqu'elle soit.
Par exemple JeSuisUnParam alors il continue la vérification de cette route. S'il n'y a rien du tout il la prendra en compte uniquement si une route n'avait pas été précédemment défini comme 
/1erElement/2emeElement/ par contre il faudra qu'il y est un / derrière le parmaètre vide par exemple /1erElement/2emeElement//
Pour résumé un paramètres peu contenir n'importe quelle valeur

3emeElement
Si un /3emeElement se trouve derrière le 1erParam vide ou non alors il continue la vérification

2emeParam
Si l'url se termine par un / ou /unParamAuHasard alors la route complète est validé et du coup il utilisera celle-ci

*/

router.use((request, response) => {
    response.status(404);
    response.render('error', {status: 404});
});

module.exports = router;
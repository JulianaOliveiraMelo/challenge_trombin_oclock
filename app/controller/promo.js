const path = require('path');
const logger = require(path.join(__dirname,'..','logger'));
//const promos = require('../data/promos.json');
// __dirname = /Users/yann/Sites/oClock/Zenith/s4/Trombin-o-clock-zenith/app/controller/../data/promo.json
// Nous n'utilisonsj plus les JSON : const promoList = require(path.join(__dirname, '..', 'data', 'promo.json'));

// Dans notre controller on va require notre dataMapper qui nous permettra de réucupérer nos promos grâce à la table "promo"
const dataMapper = require(path.join(__dirname, '..', 'dataMapper'));

const promoController = {

    /*
    Méthode permettant de d'afficher la liste de toutes les promos
    */
    promoList: (request,response) => {

        dataMapper.getAllPromo((promoList) => {
            // Envoi de données sous forme de d'objet directement
            response.render('promoList', {promoList: promoList});
        });

        // Envoi de données sous form de variable contenant un objet
        /*
        const data = {promoList: promoList};
        response.render('promoList', data);
        */
    },

    /*
    Méthode permettant de filtrer, récupérer et afficher une promo en particulier. En fonction des paramêtres de requête reçus
    */
    promo: (request,response) => {
        // NTUI : Never Trust User Input
        const promoId = parseInt(request.params.id);

        const promoName = request.params.name;
        // Dans le cas ou le paramètre id n'est pas un numéro
        // On affiche une page 404
        if(isNaN(promoId)){
            response.status(404);
            response.render('error', {status: 404, message: "l'id de la promo doit être un numéro"});
        }else{

            dataMapper.getOnePromoById(promoId,(promo) => {
                // Envoi de données sous forme de d'objet directement

                if(typeof promo === 'undefined'){
                    response.status(404);
                    response.render('error', {status: 404, message: "Aucune promo n'a été trouvé avec ces paramètres"});
                } else {
    
                    // promo correspond à (par exemple) : 
                    // {"id":93,"name":"Zenith","github_organization":"https://github.com/O-clock-Zenith"}
                    response.render('promo', promo);
                    
                }
            });

            // On filtre le tableau des promos en ne récupérant que l'objet dont la clé id correspond à l'id envoyé en paramètre
            /*
            On n'utilise plus les JSON
            const promo = promoList.filter(
                promoElem =>  {
                    // Ici on donne une condition de filtrage à notre filter : Si l'id et le nom correspondent au paramètres de la requête
                    //alors il renvoi true et séléctionne donc l'élément correspond (ici un objet {})
                    // {"id":93,"name":"Zenith","github_organization":"https://github.com/O-clock-Zenith"}
                    // avec l'ensemble de ses propiriétés
                    return (promoElem.id === promoId 
                    && promoElem.name.toLowerCase() === promoName.toLowerCase()
                    )
                }
            ).pop();
            */
            
            
        }

    },

    promoEdit: (request,response) => {

        //On ajoute une vérification de connexion d'utilisateuyr
        // Si la personne n'est pas connecté on redirige vers la page d'accueil
        if(!request.session.logged){
            response.redirect('/login');
        }

        const promoId = parseInt(request.params.id);

        if(isNaN(promoId)){
            response.status(404);
            response.render('error', {status: 404, message: "l'id de la promo doit être un numéro"});
        }else{

            dataMapper.getOnePromoById(promoId,(promo) => {
                // Envoi de données sous forme de d'objet directement

                if(typeof promo === 'undefined'){
                    response.status(404);
                    response.render('error', {status: 404, message: "Aucune promo n'a été trouvé avec ces paramètres"});
                } else {
                    //promo = {id: 1, name: 'zenith', github_organization: 'http://....'}
                    response.render('promoEdit', promo);
                }
                console.log('FIN DU CALLBACK DATAMAPPER');
            });

            
        }
        console.log('FIN DE LA METHODE PROMOEDIT');
    },

    promoUpdate: (request, response) => {

        const promoId = parseInt(request.params.id);

        if(isNaN(promoId)){
            response.status(404);
            response.render('error', {status: 404, message: "l'id de la promo doit être un numéro"});
        }

        const data = request.body;

        // On vérifie que l'on reçois bien des données en POST
        if(!data){
            logger.error('Aucune données lors du post promoUpdate');
            // Si ce n'est pas le cas on redirige l'utilisateur vers la page d'accueil
            response.redirect('/');
            // Afin de s'assurer que le reste des instruction dans cette méthode n'est pas exécuter on fais un return. La valeur retourné n'est pas importante
            return;
        }

        // On s'assure que les 2 clés attendu sont bien présentes
        if(!data.name || !data.github_organization){
            logger.error('Donnée manquante lors du post promoUpdate');
            response.redirect('/');
            return;
        }

        // On vérifie que les informations de ne sont pas vide
        // A partir de se moment là l'on considère que le processus est normal et on ne redirige plus vers l'accueil, mais on affiche un message à l'utilisateur

        // On ajoute l'id de la promo à nos données reçues en POST afin de l'envoyé en même temps à la requête de mise et à la vue
        data.id = promoId;

        if(data.name === ''){
            data.message = 'Vous devez indiquer un nom';
            data.error = true;
        }

        if(data.github_organization === ''){
            data.message = 'Vous devez indiquer une url github';
            data.error = true;
        }

        // A partir de ce moment là nous avons l'id de la promo, le nouveau nom de la promo, et l'url github de la promo.
        // On va pouvoir faire la mise à jour

        dataMapper.updateOnePromoById(data, (success) => {
            // Si le retour de mise à jour est un succès, alors on affiche la réponse à l'utilisateur
            if(success){
                data.message = 'La promo à bien été mise à jour';
            }else{
                //sinon on affiche un message d'erreur
                data.message = "Une erreur s'est produite lors de la mise à jour de la promo, veuillez réessayer plus tard.";
                data.error = true;
            }



            response.render('promoEdit', data);

        });

    }

};

module.exports = promoController;
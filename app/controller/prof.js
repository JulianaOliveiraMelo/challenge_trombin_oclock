const path = require('path');
const logger = require(path.join(__dirname, '..', 'logger'));

const dataMapper = require(path.join(__dirname, '..', 'dataMapper'));

const profController = {

    // Contoller nécessaire à l'affichage de la page "liste des porfs d'un promo"
    // Ce controller va être chargé de récupérer les données grâce au dataMapper, et de les envoyer à la vue
    // Et accessoirement d'éxecuter un peu de logique applicative
    profList: (request, response) => {

        // on stocke le paramètre d'URL qui vient de notre route dynamique /promo/:id/prof
        const promoId = parseInt(request.params.id);

        if (isNaN(promoId)) {
            response.status(404);
            response.render('error', { status: 404, message: "l'id de la promo doit être un numéro" });
        } else {
            // On récupère nos données en envoyant le promoId
            // On attends que la récupération soit terminé avent d'affiché la vue, grâce à un callback
            dataMapper.getProfByPromoId(promoId, (promoProfs) => {
                // Pour finalement récupérer notre liste de profs
                // Que a son tour envoyé dans la vue.
                response.render('profs', { promoProfs: promoProfs });
            });
        }

    },

    prof: (request, response) => {

        const profId = parseInt(request.params.id);

        if (isNaN(profId)) {
            response.status(404);
            response.render('error', { status: 404, message: "l'id du prof doit être un numéro" });
        } else {

            dataMapper.getOneProfById(profId, (prof) => {
                response.render('prof', prof);
            });
        }


    }

};

module.exports = profController;
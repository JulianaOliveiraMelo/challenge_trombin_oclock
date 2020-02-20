const path = require('path');
const logger = require(path.join(__dirname, '..', 'logger'));

//const promos = require(path.join(__dirname, '..', 'data', 'promo.json'));
//const students = require(path.join(__dirname, '..', 'data', 'student.json'));
// Dans notre controller on va require notre dataMapper qui nous permettra de réucupérer nos promos grâce à la table "promo"
const dataMapper = require(path.join(__dirname, '..', 'dataMapper'));

const studentController = {

    studentList: (request, response) => {

        const promoId = parseInt(request.params.id);

        if (isNaN(promoId)) {
            response.status(404);
            response.render('error', { status: 404, message: "l'id de la promo doit être un numéro" });
        } else {
            // On commence a filtrer les tableau des étudiants
            /*
            const promoStudents = students.filter(studentElem => studentElem.promo === promoId);
            */
            dataMapper.getStudentByPromoId(promoId, (promoStudents) => {

                // On peut très bien appeler une nouvelle méthode de notre module dataMapper qui lui aussi appelera une function de callback afin de finalement afficher la vue.
                dataMapper.getOnePromoById(promoId, (promo) => {

                    response.render('students', { promoStudents: promoStudents, promo: promo });

                });

            });
            // On récupère également la promo afin d'afficher le nom de celle-ci en haut de la page
            //const promo = promos.filter(promoElem => promoElem.id === promoId).pop();
            // On gère l'affichage de la page
            //response.render('students', { promoStudents: promoStudents, promo: promo });
        }

    },

    student: (request, response) => {

        const studentId = parseInt(request.params.id);

        if (isNaN(studentId)) {
            response.status(404);
            response.render('error', { status: 404, message: "l'id de l'étudiant doit être un numéro" });
        } else {
            // on Sélectionne l'étudiant ayant l'id demandé parmis la liste des étudiants présent dans le JSON
            /*
            const student = students.filter(studentElem => studentElem.id === studentId).pop();
            */

            // Ici on récupère la promo qui correspond à l'étudiant
            // afin de pouvoir affichier le nom de cette promo dans la fiche de l'étudiant
            /*
            const promo = promos.filter(promoElem => promoElem.id === student.promo).pop();
            */

            // On rattache le nom de la promo à l'objet contenant les informations de l'étudiant

            dataMapper.getOneStudentById(studentId, (student) => {

                dataMapper.getOnePromoById(student.promo_id, (promo) => {

                    student.promo_name = promo.name;
                    response.render('student', student);

                });
            });
        }


    },

    studentEdit: (request, response) => {
        // Récupération de l'indentifiant de l'étudiant
        const studentId = parseInt(request.params.id);

        if(isNaN(studentId)){
            response.status(404);
            response.render('error', {status: 404, message: "l'id de l' étudiant doit être un numéro"});
        }else{

            dataMapper.getOneStudentById(studentId,(student) => {
                // Envoi de données sous forme de d'objet directement

                if(typeof student === 'undefined'){
                    response.status(404);
                    response.render('error', {status: 404, message: "Aucun étudiant n'a été trouvé avec ces paramètres"});
                } else {
                    response.render('studentEdit', student);
                }
            });
        }
    },

    studentUpdate: (request, response) => {

        const studentId = parseInt(request.params.id);

        if(isNaN(studentId)){
            response.status(404);
            response.render('error', {status: 404, message: "l'id de l'étudiant doit être un numéro"});
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
        if(!data.first_name || !data.last_name || !data.github_username){
            logger.error('Donnée manquante lors du post studentUpdate');
            response.redirect('/');
            return;
        }

        // On vérifie que les informations de ne sont pas vide
        // A partir de se moment là l'on considère que le processus est normal et on ne redirige plus vers l'accueil, mais on affiche un message à l'utilisateur

        // On ajoute l'id de la promo à nos données reçues en POST afin de l'envoyé en même temps à la requête de mise et à la vue
        data.id = studentId;

        if(data.first_name === ''){
            data.message = 'Vous devez indiquer un prénom';
            data.error = true;
        }

        if(data.last_name === ''){
            data.message = 'Vous devez indiquer un nom';
            data.error = true;
        }

        if(data.github_username === ''){
            data.message = 'Vous devez indiquer un pseudo github';
            data.error = true;
        }

        // A partir de ce moment là nous avons l'id de la promo, le nouveau nom de la promo, et l'url github de la promo.
        // On va pouvoir faire la mise à jour

        dataMapper.updateOneStudentById(data, (success) => {
            // Si le retour de mise à jour est un succès, alors on affiche la réponse à l'utilisateur
            if(success){
                data.message = "L'étudiant à bien été mise à jour";
            }else{
                //sinon on affiche un message d'erreur
                data.message = "Une erreur s'est produite lors de la mise à jour de l'étudiant, veuillez réessayer plus tard.";
                data.error = true;
            }

            response.render('studentEdit', data);

        });
    }

};

module.exports = studentController;
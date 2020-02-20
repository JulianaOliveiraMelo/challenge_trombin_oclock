const path = require('path');
const logger = require(path.join(__dirname, 'logger'));

// On require notre nouveau module pour communiquer avec postrgeSQL
const { Client } = require('pg');

// On défini l'uri de connection à notre base trombinoclock
const connectionString = process.env.PNG;

// On intialize notre client postgreSQL
const pg = new Client({
    connectionString: connectionString
});

// On se connecte à la base de donnée
pg.connect();

const dataMapper = {

    // getAllPromo prend en paramètre callback qui contiendra une function à exécuter plus tard
    getAllPromo: (callback) => {
        // J'envoi ma requête au serveur postgreSQL
        // Une fois la reqêute terminé, il va me renvoyer 2 objet
        // error : qui contiendra différentes informations liés a cette erreur, s'il y en a une
        // result : qui contiendra différentes informations concenrant les resultat de ma requête
        // l'objet on va pouvoir renvoyer la liste des enregistrement a notre callback
        pg.query('SELECT * FROM promo', (error, result) => {
            if (error) {
                logger.error(error.stack);
            } else {
                // Ici on renvoi uniquement la propriété rows de notre objet result
                callback(result.rows);
            }
        });
    },

    getOnePromoById: (id, callback) => {
        console.log('getOnePromoById');
        const preparedQuery = {
            text: 'SELECT * FROM promo WHERE id = $1::int',
            // Values se charge de remplir les $1, $1, $3 ... indiqués dans le texte de la requête
            // $1: corerespond au premier élément du tableau
            // $2: au deuxième et ainsi de suite
            values: [id]
        };
        pg.query(preparedQuery, (error, result) => {
            if (error) {
                logger.error(error.stack);
            } else {
                callback(result.rows[0]);
            }
        })
    },

    // Ici on a besoin du promo_id pour créer notre requête
    // Et d'une function de callback qui se chargera de récupérer le résultat
    getStudentByPromoId: (promo_id, callback) => {
        const preparedQuery = {
            text: 'SELECT * FROM student WHERE promo_id = $1::int',
            values: [promo_id]
        };
        pg.query(preparedQuery, (error, result) => {
            if (error) {
                logger.error(error.stack);
            } else {
                callback(result.rows);
            }
        });
    },

    getOneStudentById: (id, callback) => {
        const preparedQuery = {
            text: 'SELECT * FROM student WHERE id = $1::int',
            values: [id]
        };
        pg.query(preparedQuery, (error, result) => {
            if (error) {
                logger.error(error.stack);
            } else {
                callback(result.rows[0])
            }
        });
    },

    updateOnePromoById: (data, callback) => {
        /*
        Requête d'exemple : 
        UPDATE promo
        SET
        name = 'Zenith',
        github_organization = 'http://…'
        WHERE id = 93
        */
        const preparedQuery = {
            text: `
                UPDATE promo
                SET
                name = $1::text,
                github_organization = $2::text
                WHERE id = $3::int
            `,
            values: [
                data.name,
                data.github_organization,
                data.id
            ]
        };

        pg.query(preparedQuery, (error, result) => {
            if (error) {
                logger.error(error.stack);
            } else {
                callback(result.rowCount);
            }
        });

    },

    updateOneStudentById: (data, callback) => {
        /*
        Requête d'exemple : 
        UPDATE student
        SET
        first_name = 'Andrea',
        last_name = 'FUKS',
        github_username = 'FuksAndrea14'
        WHERE id = 534
        */
        const preparedQuery = {
            text: `
                UPDATE student
                SET
                first_name = $1::text,
                last_name = $2::text,
                github_username = $3::text
                WHERE id = $4::int
            `,
            values: [
                data.first_name,
                data.last_name,
                data.github_username,
                data.id
            ]
        };

        pg.query(preparedQuery, (error, result) => {
            if (error) {
                logger.error(error.stack);
            }
            callback(result.rowCount);
        });

    },

    // Notre méthode de récupération des profs en base de données
    // Prend en paramètre le'id de la promo (qui nous servira à filtrer dans notre requête SQL)
    // Et un function de retour (callback) qui sera exécuté en fin de méthode pour renvoyer les données au controller
    getProfByPromoId : (promoId, callback) => {

        // Notre requête nous permet de récupérer en même temps les informations DES profs et de LA promo
        const preparedQuery = {
            text: `
                SELECT

                prof.id AS prof_id,
                promo.id AS promo_id,
                prof.first_name,
                prof.last_name,
                prof.github_username,
                promo.name as promo_name

                FROM prof 
                JOIN prof_promo 
                ON prof.id = prof_promo.prof_id
                JOIN promo 
                ON promo.id = prof_promo.promo_id

                WHERE prof_promo.promo_id = $1::int;
            `,
            values: [promoId]
        };

        // On exécute la requêtes sur le server Postgres
        // Une fois la requêtes terminé le driver PG appelera notre function de retour (callback) en lui enviyant en premier paramètre l'erreur (s'il y a) et le résultat (sinon)
        pg.query(preparedQuery, (error, result) => {
            if(error){
                logger.error(error.stack);
            }
            // On renvoi les lignes de notre resultat au callback spécifié dans le controller
            callback(result.rows);
        });
    },

    getOneProfById: (profId, callback) => {

        const preparedQuery = {
            text: `
                SELECT

                prof.id AS prof_id,
                promo.id AS promo_id,
                prof.first_name,
                prof.last_name,
                prof.github_username,
                promo.name as promo_name

                FROM prof 
                JOIN prof_promo 
                ON prof.id = prof_promo.prof_id
                JOIN promo 
                ON promo.id = prof_promo.promo_id

                WHERE prof_promo.prof_id = $1::int;
            `,
            values: [profId]
        };

        pg.query(preparedQuery, (error, result) => {
            if(error){
                logger.error(error.stack);
            }

            // Afin de ne récupérer qu'une seule ligne, mais avec toutes les promos, on créer un nouvel objet dans lequel on va stocker toutes les promos dans un tableau + les informations de base du prof
            // On initialise directement la propriété promoList que serta chargé de stocker les différentes promo
            const prof = {
                promoList: []
            };
            
            for(let row of result.rows){

                prof.prof_id = row.prof_id;
                prof.first_name = row.first_name;
                prof.last_name = row.last_name;
                prof.github_username = row.github_username;

                // intialisation de notre tableau de promos
                // comme a chaque tour de boucle il exécute ceci
                // Il faut vérifier avant de réinitialiser notre propriété promo, sinon celle -ci redeviendra a chaque tour de boucle un tableau vide.
                /*
                if(!prof.promoList){
                    prof.promoList = [];
                }
                Finalement on a décidé d'initialiser directement le tableau dans l'initialisation de l'objet prof
                */

                // On ajoute pour chaque ligne de résultat (qui en fait correspondent au promos dans lesquels le prof est présent) un nouvel objet, représentant la promo, dans le tableau prévu a cet effet
                const currentPromo = {
                    name: row.promo_name,
                    id: row.promo_id
                };
                prof.promoList.push(currentPromo);

            }

            callback(prof);
        })

    }

};

module.exports = dataMapper;


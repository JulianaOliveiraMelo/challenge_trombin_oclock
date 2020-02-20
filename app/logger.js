/*
Afin d'avoir un contrôle particulier sur les message de log
On a créé un nouveau module "logger", afin d'encadrer l'affichage ou non des messages
Ici nous avons créer une méthode debug qui nous permet d'affiché des message dans un environnement de développment grâce à la variable "DEBUG" dans le fichier .env situé à la racine du projet.
Celui-ci étant gérer par le module npm "dotenv", qui ajoute dans l'objet "process.env" les différentes variables définis dans celui-ci
*/

const logger = {

    debug: (message) => {
        if (process.env.DEBUG) {
            console.log(message);
        }
    },

    error: (message) => {
        console.error(`[${new Date()}] ${message}`);
    }

};

module.exports = logger;
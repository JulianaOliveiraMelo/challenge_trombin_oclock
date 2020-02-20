// Un controller est chargé de gérer la logique et d'afficher les vues
const mainController = {

    homePage: (request, response) => {
        response.render('home');
    },

    contactPage: (request, response) => {
        response.render('contact');
    },

    loginPage: (request, response) => {

        const username = request.body.username;

        let message;
        let error = false;

        if (username) {
            if (username === 'Yann') {
                // Login ok
                // On stocke de nouvelles valeurs dans de nouvelles propriétés de l'object session
                request.session.logged = true;
                request.session.username = username;

                // Redirection vers la page d'accueil
                //response.redirect('/');

                // Au lieu de rediriger vers la page d'accueil on redirige vers la page d'ou provient le clic de login; En fait la dernière page de l'historique -2 page de login (affichage et post)
                console.log(request.session.history);

                // afin de ne pas perturbé la lecture de l'historique avec de multiple accès à la page login
                // On filtre le tableau de l'historique
                const history = request.session.history.filter(page => page !== '/login');

                // Puis on redirige vers la dernière page accédé avant le login
                response.redirect(history.pop());

                return;
            } else {
                // Login pas ok
                message = "Cet identifiant n'est pas valide";
                error = true;
            }
        }

        response.render('login', { message: message, error: error });
    }

};

module.exports = mainController;
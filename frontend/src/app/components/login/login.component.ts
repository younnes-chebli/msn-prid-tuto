import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit, AfterViewInit {
    loginForm!: FormGroup;
    loading = false;    // utilisé en HTML pour désactiver le bouton pendant la requête de login
    submitted = false;  // retient si le formulaire a été soumis ; utilisé pour n'afficher les 
    // erreurs que dans ce cas-là (voir template)
    returnUrl?: string;
    error = '';

    /**
     * Le décorateur ViewChild permet de récupérer une référence vers un objet de type ElementRef
     * qui encapsule l'élément DOM correspondant. On peut ainsi accéder au DOM et le manipuler grâce
     * à l'attribut 'nativeElement'. Le paramètre 'pseudo' que l'on passe ici correspond au tag
     * que l'on a associé à cet élément dans le template HTML sous la forme de #<tag>. Ici par
     * exemple <input #pseudo id="pseudo"...>.
     *
     * Dans ce cas précis-ci, on a besoin d'accéder au DOM de ce champ car on veut mettre le focus
     * sur ce champ quand la page s'affiche. Pour cela, il faut passer par le DOM.
     */
    @ViewChild('pseudo') pseudo!: ElementRef;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUser) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        /**
         * Ici on construit le formulaire réactif. On crée un 'group' dans lequel on place deux
         * 'controls'. Remarquez que la méthode qui crée les controls prend comme paramêtre une
         * valeur initiale et un tableau de validateurs. Les validateurs vont automatiquement
         * vérifier les valeurs encodées par l'utilisateur et reçues dans les FormControls grâce
         * au binding, en leur appliquant tous les validateurs enregistrés. Chaque validateur
         * qui identifie une valeur non valide va enregistrer une erreur dans la propriété
         * 'errors' du FormControl. Ces erreurs sont accessibles par le template grâce au binding.
         */
        this.loginForm = this.formBuilder.group({
            pseudo: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    /**
     * Event standard d'angular qui nous donne la main juste après l'affichage du composant.
     * C'est le bon endroit pour mettre le focus dans le champ 'pseudo'.
     */
    ngAfterViewInit() {
        /**
         * le focus est un peu tricky : pour que ça marche, il faut absolument faire l'appel
         * à la méthode focus() de l'élément de manière asynchrone. Voilà la raison du setTimeout().
         */
        setTimeout(() => this.pseudo && this.pseudo.nativeElement.focus());
    }

    // On définit ici un getter qui permet de simplifier les accès aux champs du formulaire dans le HTML
    get f() { return this.loginForm.controls; }

    /**
     * Cette méthode est bindée sur l'événement onsubmit du formulaire. On va y faire le
     * login en faisant appel à AuthenticationService.
     */
    onSubmit() {
        this.submitted = true;

        // on s'arrête si le formulaire n'est pas valide
        if (this.loginForm?.invalid) return;

        this.loading = true;
        this.authenticationService.login(this.f?.pseudo.value, this.f?.password.value)
            .subscribe({
                // si login est ok, on navigue vers la page demandée
                next: data => {
                    this.router.navigate([this.returnUrl]);
                },
                // en cas d'erreurs, on reste sur la page et on les affiche
                error: error => {
                    console.log(error);
                    this.error = error.error.errors[0].errorMessage;
                    this.loading = false;
                }
            });
    }
}

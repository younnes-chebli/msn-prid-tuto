import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditNumber } from 'src/app/models/edit-number';

@Component({
    selector: 'edit-number',
    templateUrl: './edit-number.component.html'
})
export class EditNumberComponent implements OnInit {

    /**
     * Le modèle du nombre éditable qui doit être géré par ce composant et 
     * qui est fourni par le composant parent par binding de propriété (d'où le @Input)
     */
    @Input() public number!: EditNumber;

    /**
     * Une copie du modèle utilisé en interne par le composant pour son binding ; 
     * on travaille avec cette copie pour pouvoir récupérer la valeur initiale en cas de Cancel
     */
    public internalNumber: EditNumber = new EditNumber();

    /**
     *  Détermine le mode d'utilisation : édition (true) ou visualisation (false)
     */
    public editMode: boolean = false;

    /**
     * Permet de déclarer un événement qui sera émis par ce composant et auquel le composant parent
     * pourra souscrire ; cette manière de procéder permet d'éviter de passer une référence vers le
     * composant parent et ainsi de découpler le composant courant de ses potentiels utilisateurs : 
     * il lui suffit d'émettre l'événement, sans se préoccuper de savoir qui va être notifié et ce 
     * qu'il va faire de cette notification.
     * Le type générique de EventEmitter désigne le type de paramètre que l'on pourra passer lors de
     * l'émission de l'événement.
     */
    @Output() public numberChange: EventEmitter<EditNumber> = new EventEmitter<EditNumber>();

    ngOnInit(): void {
        // au départ on copie la valeur reçue dans internalNumber
        this.internalNumber.value = this.number.value;
    }

    /**
     * permet de passer en mode d'édition
     */
    public edit() {
        this.editMode = true;
    }

    /**
     * permet de sauver la valeur modifiée et de revenir au mode de visualisation
     */
    public save() {
        // on se remet en mode de visualisation
        this.editMode = false;
        // on sauve la valeur interne modifiée dans le modèle reçu en paramètre, ce qui rend le changement effectif
        this.number.value = this.internalNumber.value;
        // on émet l'événement numberChange avec, en paramètre, le nombre modifié
        this.numberChange.emit(this.number);
    }

    /**
     * permet d'annuler la modification de valeur et de revenir au mode de visualisation
     */
    public cancel() {
        // on se remet en mode de visualisation
        this.editMode = false;
        // on annule le changement en restaurant, en interne, la valeur interne du modèle reçu en paramètre
        this.internalNumber.value = this.number.value;
    }
}

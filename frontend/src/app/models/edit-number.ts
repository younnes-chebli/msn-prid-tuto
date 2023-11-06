import * as _ from 'lodash-es';

/**
 * Classe 'métier' qui encapsule un nombre entier éditable.
 */
export class EditNumber {
    constructor(public value: number = Math.floor(Math.random() * 20) - 10) { }
}

/**
 * Classe 'métier' qui représente un groupe de nombres éditables.
 */
export class NumberGroup {
    private _numbers: EditNumber[] = [];

    /**
     * Permet de construire le groupe en lui passant un titre 
     * et le nombre de nombres éditables souhaités.
     */
    constructor(public title: string, count: number) {
        for (let i = 0; i < count; ++i)
            this._numbers.push(new EditNumber());
    }

    get count(): number {
        return this._numbers.length;
    }

    get total(): number {
        return this._numbers.reduce((sum, n) => sum + n.value, 0);
    }

    get numbers(): readonly EditNumber[] {
        return this._numbers;
    }

    /**
     * Retourne une copie profonde du groupe
     */
    clone(): NumberGroup {
        const clone = _.cloneDeep(this);
        clone.title += " - copy"
        return clone;
    }
}

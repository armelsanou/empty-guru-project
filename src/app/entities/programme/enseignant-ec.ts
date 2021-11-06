export class EnseignantEc {
    public idEc: Number;
    public idEnseignant: Number;

    public getIdEc(): Number {
        return this.idEc;
    }

    public setIdEc(idEc: Number): void {
        this.idEc = idEc;
    }

    public getIdEnseignant(): Number {
        return this.idEnseignant;
    }

    public setIdEnseignant(idEnseignant: Number): void {
        this.idEnseignant = idEnseignant;
    }

    constructor(){}
}

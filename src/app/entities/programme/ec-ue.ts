export class EcUe {
    public idEc: Number;
    public idUe: Number;
    public annee :string;
    public creditEc: Number;

    public getIdUe(): Number {
        return this.idUe;
    }

    public setIdUe(idUe: Number): void {
        this.idUe = idUe;
    }

    public getIdEc(): Number {
        return this.idEc;
    }

    public setIdEc(idEc: Number): void {
        this.idEc = idEc;
    }

    public getAnnee(): string {
        return this.annee;
    }

    public setAnnee(annee: string): void {
        this.annee = annee;
    }

    public getCreditEc(): Number {
        return this.creditEc;
    }

    public setCreditEc(creditEc: Number): void {
        this.creditEc = creditEc;
    }

    constructor(){}
}

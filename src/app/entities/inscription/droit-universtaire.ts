export class DroitUniversitaire {
    public idPays: Number;
    public idClasse: Number;
    public annee: string;
    public montant: number;

    public getIdPays(): Number {
        return this.idPays;
    }

    public getIdClasse(): Number {
        return this.idClasse;
    }

    public getAnnee(): string {
        return this.annee;
    }

    public getMontant(): number {
        return this.montant;
    }

    public setIdpays(idPays: number): void {
        this.idPays = idPays;
    }

    public setIdclasse(idClasse: number): void {
        this.idClasse = idClasse;
    }

    public setAnnee(annee: string): void {
        this.annee = annee;
    }

    public setMontant(montant: number): void {
        this.montant = montant;
    }

    constructor() {}
}

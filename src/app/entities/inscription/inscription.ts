export class Inscription {
    public matricule: string;
    public idClasse: Number;
    public annee: string;
    public dateInscription: Date;

    public getMatricule(): string {
        return this.matricule;
    }

    public getIdClasse(): Number {
        return this.idClasse;
    }

    public getAnnee(): string {
        return this.annee;
    }

    public getDateInscription(): Date {
        return this.dateInscription;
    }

    public setMatricule(matricule: string): void {
        this.matricule = matricule;
    }

    public setIdclasse(idClasse: number): void {
        this.idClasse = idClasse;
    }

    public setAnnee(annee: string): void {
        this.annee = annee;
    }

    public setDateInscription(dateInscription: Date): void {
        this.dateInscription = dateInscription;
    }

    constructor() {}
}

export class Programme {
    
    idSemestre: number;
    idClasse: number;
    idCategorie: number;
    idUe: number;
    annee: number;
    credit: number;

    public getIdSemestre(): number {
        return this.idSemestre;
    }

    public setIdSemestre(idSemestre: number): void {
        this.idSemestre = idSemestre;
    }

    public getIdClasse() :number {
        return this.idClasse;
    }

    public setIdClasse(idClasse: number): void {
        this.idClasse = idClasse;
    }

    public getIdUe(): number {
        return this.idUe;
    }

    public setIdUe(idUe: number): void {
        this.idUe = idUe;
    }

    public getAnnee(): number {
        return this.annee;
    }

    public setAnnee(annee: number): void {
        this.annee = annee;
    }

    public getIdCategorie(): number {
        return this.idCategorie;
    }

    public setIdCategorie(idCategorie: number): void {
        this.idCategorie = idCategorie;
    }
    
    public getCredit(): number {
        return this.credit;
    }

    public setCredit(credit: number): void {
        this.credit = credit;
    }

    constructor(){}
}

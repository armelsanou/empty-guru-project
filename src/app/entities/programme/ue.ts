export class Ue {
    public idUe: Number;
    public filiere: Number;
    public codeUe:string;
    public nom :string;
    public name: string;
    public annee :string;

    public getIdUe(): Number {
        return this.idUe;
    }

    public setIdUe(idUe: Number): void {
        this.idUe = idUe;
    }

    public getFiliere(): Number {
        return this.filiere;
    }

    public setFiliere(idFiliere: Number): void {
        this.filiere = idFiliere;
    }


    public getCodeUe(): string {
        return this.codeUe;
    }

    public setCodeUe(codeUe: string): void {
        this.codeUe = codeUe;
    }

    public getNom(): string {
        return this.nom;
    }

    public setNom(nom: string): void {
        this.nom = nom;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getAnnee(): string {
        return this.annee;
    }

    public setAnnee(annee: string): void {
        this.annee = annee;
    }

}

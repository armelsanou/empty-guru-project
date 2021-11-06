export class Specialite {
    public idSpecialite: Number;
    public filiere: Number;
    public codeSpecialite:string;
    public nom :string;
    public name: string;
    public annee :string;

    public getIdSpecialite(): Number {
        return this.idSpecialite;
    }

    public setIdSpecialite(idSpecialite: Number): void {
        this.idSpecialite = idSpecialite;
    }

    public getFiliere(): Number {
        return this.filiere;
    }

    public setFiliere(idFiliere: Number): void {
        this.filiere = idFiliere;
    }


    public getCodeSpecialite(): string {
        return this.codeSpecialite;
    }

    public setCodeSpecialite(codeSpecialite: string): void {
        this.codeSpecialite = codeSpecialite;
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

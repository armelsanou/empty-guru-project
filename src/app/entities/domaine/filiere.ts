export class Filiere {
    public idFiliere: Number;
    public idSousDomaine: Number;
    public codeFiliere:string;
    public nom :string;
    public name: string;
    public annee :string;

    public getIdFiliere(): Number {
        return this.idFiliere;
    }

    public setIdFiliere(idFiliere: Number): void {
        this.idFiliere = idFiliere;
    }

    public getIdSousDomaine(): Number {
        return this.idSousDomaine;
    }

    public setIdSousDomaine(idSousDomaine: Number): void {
        this.idSousDomaine = idSousDomaine;
    }

    public getCodeFiliere(): string {
        return this.codeFiliere;
    }

    public setCodeFiliere(codeFiliere: string): void {
        this.codeFiliere = codeFiliere;
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

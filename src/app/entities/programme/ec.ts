export class Ec {
    public idEc: Number;
    public idFiliere: Number;
    public codeEc:string;
    public nom :string;
    public name: string;
    public annee :string;

    public getCodeEc(): string {
        return this.codeEc;
    }

    public setCodeEc(codeEc: string): void {
        this.codeEc = codeEc;
    }

    public getNom() :string {
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

    public getIdDomaine(): Number {
        return this.idEc;
    }

    public setIdDomaine(idEc: Number): void {
        this.idEc = idEc;
    }

    public getIdFiliere(): Number {
        return this.idEc;
    }

    public setIdFiliere(idEc: Number): void {
        this.idEc = idEc;
    }

    constructor(){}
}

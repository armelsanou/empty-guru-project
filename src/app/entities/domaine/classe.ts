export class Classe {
    public idClasse: Number;
    public codeClasse:string;
    public nom :string;
    public name: string;
    public annee :string;

    public getCodeClasse(): string {
        return this.codeClasse;
    }

    public setCodeClasse(codeClasse: string): void {
        this.codeClasse = codeClasse;
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

    public getIdClasse(): Number {
        return this.idClasse;
    }

    public setIdClasse(idClasse: Number): void {
        this.idClasse = idClasse;
    }

    constructor(){}
}

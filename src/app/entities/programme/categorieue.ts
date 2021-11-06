export class Categorieue {
    public idCategorie: Number;
    public codeCategorieue:string;
    public nom :string;
    public name: string;
    public annee :string;

    public getCodeCategorieue(): string {
        return this.codeCategorieue;
    }

    public setCodeCategorieue(codeCategorieue: string): void {
        this.codeCategorieue = codeCategorieue;
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

    public getIdCategorie(): Number {
        return this.idCategorie;
    }

    public setIdCategorie(idCategorie: Number): void {
        this.idCategorie = idCategorie;
    }

    constructor(){}
}

export class Domaine {
    public idDomaine: Number;
    public codeDomaine:string;
    public nom :string;
    public name: string;
    public annee :string;

    public getCodeDomaine(): string {
        return this.codeDomaine;
    }

    public setCodeDomaine(codeDomaine: string): void {
        this.codeDomaine = codeDomaine;
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
        return this.idDomaine;
    }

    public setIdDomaine(idDomaine: Number): void {
        this.idDomaine = idDomaine;
    }

    constructor(){}
}

export class SousDomaine {
    public idSousDomaine: Number;
    public idDomaine: Number;
    public codeSousDomaine: string;
    public nom : string;
    public name: string;
    public annee :string;

    public getIdSousDomaine(): Number {
        return this.idSousDomaine;
    }

    public setIdSousDomaine(idSousDomaine: Number): void {
        this.idSousDomaine = idSousDomaine;
    }
    public getIdDomaine(): Number {
        return this.idDomaine;
    }

    public setIdDomaine(idDomaine: Number): void {
        this.idDomaine = idDomaine;
    }

    public getCodeSousDomaine(): string {
        return this.codeSousDomaine;
    }

    public setCodeSousDomaine(codeSousDomaine: string): void {
        this.codeSousDomaine = codeSousDomaine;
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

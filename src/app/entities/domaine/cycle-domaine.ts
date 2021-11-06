export class CycleDomaine {
    public idDomaine: Number;
    public codeCycle:string;
    public annee :string;

    public getIdDomaine(): Number {
        return this.idDomaine;
    }

    public setIdDomaine(idDomaine: Number): void {
        this.idDomaine = idDomaine;
    }

    public getCodeCycle(): string {
        return this.codeCycle;
    }

    public setCodeCycle(codeCycle: string): void {
        this.codeCycle = codeCycle;
    }

    public getAnnee(): string {
        return this.annee;
    }

    public setAnnee(annee: string): void {
        this.annee = annee;
    }

    constructor(){}
}

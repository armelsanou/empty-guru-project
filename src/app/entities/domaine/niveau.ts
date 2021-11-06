export class Niveau {
    public idNiveau: Number;
    public codeCycle:string;
    public codeNiveau:string;
    public nom :string;
    public numero: Number;
    public annee :string;

    public getIdNiveau(): Number {
        return this.idNiveau;
    }

    public setIdNiveau(idNiveau: Number): void {
        this.idNiveau = idNiveau;
    }

    public getCycle(): string {
        return this.codeCycle;
    }

    public setCycle(codeCycle: string): void {
        this.codeCycle = codeCycle;
    }

    public getCodeNiveau(): string {
        return this.codeNiveau;
    }

    public setCodeNiveau(codeNiveau: string): void {
        this.codeNiveau = codeNiveau;
    }

    public getNom(): string {
        return this.nom;
    }

    public setNom(nom: string): void {
        this.nom = nom;
    }

    public getNumero(): Number {
        return this.numero;
    }

    public setNumero(numero: Number): void {
        this.numero = numero;
    }

    public getAnnee(): string {
        return this.annee;
    }

    public setAnnee(annee: string): void {
        this.annee = annee;
    }

}

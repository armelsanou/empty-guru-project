export class Cycle {
    public idCycle: Number;
    public codeCycle:string;
    public nom :string;
    public name: string;
    public annee :string;

    public getIdCycle(): Number {
        return this.idCycle;
    }

    public setIdCycle(idCycle: Number): void {
        this.idCycle = idCycle;
    }

    public getCodeCycle(): string {
        return this.codeCycle;
    }

    public setCodeCycle(codeCycle: string): void {
        this.codeCycle = codeCycle;
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

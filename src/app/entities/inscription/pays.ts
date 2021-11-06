export class Pays {
    public idPays: Number;
    public codePays: string;
    public nom: string;
    public name: string;

    public getCodePays(): string {
        return this.codePays;
    }

    public setCodePays(codePays: string): void {
        this.codePays = codePays;
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

    public getIdPays(): Number {
        return this.idPays;
    }

    public setIdPays(idPays: Number): void {
        this.idPays = idPays;
    }

    constructor() {}
}

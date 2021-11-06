export class Banque {
    public idBanque: Number;
    public codeBanque: string;
    public nom: string;
    public name: string;

    public getCodeBanque(): string {
        return this.codeBanque;
    }

    public setCodeBanque(codeBanque: string): void {
        this.codeBanque = codeBanque;
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

    public getIdBanque(): Number {
        return this.idBanque;
    }

    public setIdBanque(idBanque: Number): void {
        this.idBanque = idBanque;
    }

    constructor() {}
}

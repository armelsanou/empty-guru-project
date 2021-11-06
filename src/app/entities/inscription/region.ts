export class Region {
    public idRegion: Number;
    public idPays: Number;
    public codeRegion: string;
    public nom: string;
    public name: string;

    public getCodeRegion(): string {
        return this.codeRegion;
    }

    public setCodeRegion(codeRegion: string): void {
        this.codeRegion = codeRegion;
    }

    public getIdPays(): Number {
        return this.idPays;
    }

    public setIdPays(idPays: Number): void {
        this.idPays = idPays;
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

    public getIdRegion(): Number {
        return this.idRegion;
    }

    public setIdRegion(idRegion: Number): void {
        this.idRegion = idRegion;
    }

    constructor() {}
}

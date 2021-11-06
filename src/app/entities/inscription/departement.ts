export class Departement {
    
    public idRegion: Number;
    public idDepartement: Number;
    public codeDepartement: string;
    public nom: string;
    public name: string;

    public getIdRegion(): Number {
        return this.idRegion;
    }

    public setIdRegion(idRegion: Number): void {
        this.idRegion = idRegion;
    }

    public getCodeDepartement(): string {
        return this.codeDepartement;
    }

    public setCodeDepartement(codeDepartement: string): void {
        this.codeDepartement = codeDepartement;
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

    public getIdDepartement(): Number {
        return this.idDepartement;
    }

    public setIdDepartement(idDepartement: Number): void {
        this.idDepartement = idDepartement;
    }

    constructor() {}
}

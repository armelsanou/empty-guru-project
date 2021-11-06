export class Enseignant {
    public idEnseignant: Number;
    public nom :string;
    public genre:string;
    public telephone: Number;
    public ville :string;


    public getNom() :string {
        return this.nom;
    }

    public setNom(nom: string): void {
        this.nom = nom;
    }

    public getGenre(): string {
        return this.genre;
    }

    public setGenre(genre: string): void {
        this.genre = genre;
    }

    public getTelephone(): Number {
        return this.telephone;
    }

    public setTelephone(telephone: Number): void {
        this.telephone = telephone;
    }

    public getVille(): string {
        return this.ville;
    }

    public setVille(ville: string): void {
        this.ville = ville;
    }

    public getIdEnseignant(): Number {
        return this.idEnseignant;
    }

    public setIdEnseignant(idEnseignant: Number): void {
        this.idEnseignant = idEnseignant;
    }

    constructor(){}
}

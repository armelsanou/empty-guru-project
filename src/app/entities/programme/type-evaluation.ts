export class TypeEvaluation {
    public idTypeEvaluation: Number;
    public codeTypeEvaluation:string;
    public nom :string;
    public name: string;
    public annee :string;

    public getCodeTypeEvaluation(): string {
        return this.codeTypeEvaluation;
    }

    public setCodeTypeEvaluation(codeTypeEvaluation: string): void {
        this.codeTypeEvaluation = codeTypeEvaluation;
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

    public getIdTypeEvaluation(): Number {
        return this.idTypeEvaluation;
    }

    public setIdTypeEvaluation(idTypeEvaluation: Number): void {
        this.idTypeEvaluation = idTypeEvaluation;
    }

    constructor(){}
}

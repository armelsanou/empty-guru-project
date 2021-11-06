export class Evaluation {
    public idEc: Number;
    public idTypeEvaluation:Number;
    public idClasse:Number;
    public annee :string;
    public coef: Number;

    public getIdEc(): Number {
        return this.idEc;
    }

    public setIdEc(idEc: Number): void {
        this.idEc = idEc;
    }

    public getIdClasse(): Number {
        return this.idClasse;
    }

    public setIdClasse(idClasse: Number): void {
        this.idClasse = idClasse;
    }

    public getCoef(): Number {
        return this.coef;
    }

    public setCoef(coef: Number): void {
        this.coef = coef;
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

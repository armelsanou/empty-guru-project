export class Semestre {
    public idSemestre: Number;
    public codeNiveau: String;
    public codeSemestre:string;
    public nom :string;
    public numero: Number;
    public annee :string;
    public credit: Number;

    public getIdSemestre(): Number {
        return this.idSemestre;
    }

    public setIdSemestre(idSemestre: Number): void {
        this.idSemestre = idSemestre;
    }

    public getNiveau(): String {
        return this.codeNiveau;
    }

    public setNiveau(codeNiveau: String): void {
        this.codeNiveau = codeNiveau;
    }


    public getCodeSemestre(): string {
        return this.codeSemestre;
    }

    public setCodeSemestre(codeSemestre: string): void {
        this.codeSemestre = codeSemestre;
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

    public getCredit(): Number {
        return this.credit;
    }

    public setCredit(credit: Number): void {
        this.credit = credit;
    }

    public getAnnee(): string {
        return this.annee;
    }

    public setAnnee(annee: string): void {
        this.annee = annee;
    }

}

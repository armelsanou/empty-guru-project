export class Paiement {
    
    public matricule: string;
    public idBanque: Number;
    public numero: string;
    public annee: string;
    public montant: Number;
    public datePaiement: string;
    public observation: string;

    public getMatricule(): string {
        return this.matricule;
    }

    public getIdBanque(): Number {
        return this.idBanque;
    }

    public getNumero(): string {
        return this.numero;
    }

    public getAnnee(): string {
        return this.annee;
    }

    public getMontant(): Number {
        return this.montant;
    }

    public getDatePaiement(): string {
        return this.datePaiement;
    }

    public getObservation(): string {
        return this.observation;
    }

    public setMatricule(matricule): void {
        this.matricule = matricule;
    }

    public setIdBanque(idBanque): void {
        this.idBanque = idBanque;
    }

    public setNumero(numero): void {
        this.numero = numero;
    }

    public setAnnee(annee): void {
        this.annee = annee;
    }

    public setMontant(montant): void {
        this.montant = montant;
    }

    public setDatePaiement(datePaiement): void {
        this.datePaiement = datePaiement;
    }

    public setObservation(observation): void {
        this.observation = observation;
    }

    constructor() {}
}

export class Etudiant {
    public matricule: string;
    public idDepartement: Number;
    public nom: string;
    public sexe: string;
    public dateNaissance: Date;
    public lieuNaissance: string;
    public telephone: string;
    public adresse: string;
    public pere: string;
    public mere: string;
    public telParent: string;
    public diplome: string;
    public anneeDiplome: Number;
    public moyenneDiplome: Number;
    public mentionDiplome: string;
    public dateInscription: Date;
    public langue: string;
    public refugie: string;
    public handicape: string;

    public getMatricule(): string {
        return this.matricule;
    }

    public setMatricule(matricule: string): void {
        this.matricule = matricule;
    }

    public getIdDepartement(): Number {
        return this.idDepartement;
    }

    public setIdDepartement(idDepartement: Number): void {
        this.idDepartement = idDepartement;
    }

    public getNom(): string {
        return this.nom;
    }

    public setNom(nom: string): void {
        this.nom = nom;
    }

    public getSexe(): string {
        return this.sexe;
    }

    public setSexe(sexe: string): void {
        this.sexe = sexe;
    }

    public getDateNaissance(): Date {
        return this.dateNaissance;
    }

    public setDateNaissance(dateNaissance: Date): void {
        this.dateNaissance = dateNaissance;
    }

    public getLieuNaissance(): string {
        return this.lieuNaissance;
    }

    public setLieuNaissance(lieuNaissance: string): void {
        this.lieuNaissance = lieuNaissance;
    }

    public getTelephone(): string {
        return this.telephone;
    }

    public setTelephone(telephone: string): void {
        this.telephone = telephone;
    }

    public getAdresse(): string {
        return this.adresse;
    }

    public setAdresse(adresse: string): void {
        this.adresse = adresse;
    }

    public getPere(): string {
        return this.pere;
    }

    public setPere(pere: string): void {
        this.pere = pere;
    }

    public getMere(): string {
        return this.mere;
    }

    public setMere(mere: string): void {
        this.mere = mere;
    }

    public getTelParent(): string {
        return this.telParent;
    }

    public setTelParent(telParent: string): void {
        this.telParent = telParent;
    }

    public getDiplome(): string {
        return this.diplome;
    }

    public setDiplome(diplome: string): void {
        this.diplome = diplome;
    }

    public getAnneeDiplome(): Number {
        return this.anneeDiplome;
    }

    public setAnneeDiplome(anneeDiplome: Number): void {
        this.anneeDiplome = anneeDiplome;
    }

    public getMoyenneDiplome(): Number {
        return this.moyenneDiplome;
    }

    public setMoyenneDiplome(moyenneDiplome: Number): void {
        this.moyenneDiplome = moyenneDiplome;
    }

    public getMentionDiplome(): string {
        return this.mentionDiplome;
    }

    public setMentionDiplome(mentionDiplome: string): void {
        this.mentionDiplome = mentionDiplome;
    }

    public getDateInscription(): Date {
        return this.dateInscription;
    }

    public setDateInscription(dateInscription: Date): void {
        this.dateInscription = dateInscription;
    }

    public getLangue(): string {
        return this.langue;
    }

    public setLangue(langue: string): void {
        this.langue = langue;
    }

    public getRefugie(): string {
        return this.refugie;
    }

    public setRefugie(refugie: string): void {
        this.refugie = refugie;
    }

    public getHandicape(): string {
        return this.handicape;
    }

    public setHandicape(handicape: string): void {
        this.handicape = handicape;
    }

    constructor() {}
}

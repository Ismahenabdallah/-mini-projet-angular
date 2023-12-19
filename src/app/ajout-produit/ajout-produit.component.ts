import { Component } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { Produit } from '../model/protuit';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ajout-produit',
  templateUrl: './ajout-produit.component.html',
  styleUrls: ['./ajout-produit.component.css']
})
export class AjoutProduitComponent {
  ajout: boolean = false;
  nouveauProduit: Produit[] = [];
  produitCourant = new Produit();
  constructor(private produitsService: ProduitsService, private router: Router) {

  }

  consulterProduits() {
    console.log("Récupérer la liste des produits");
    //Appeler la méthode 'getProduits' du service pour récupérer les données du JSON
    this.produitsService.getProduits()
      .subscribe(
        {
          //En cas de succès
          next: data => {
            console.log("Succès GET");
            this.nouveauProduit = data;
            console.log("Produits", this.nouveauProduit)
          },
          //En cas d'erreur
          error: err => {
            console.log("Erreur GET");
          }
        }
      )
  }
  ngOnInit(): void {
    //Message affiché au moment de l'affichage du composant
    console.log("Initialisation du composant:.....");
    //charger les données
    this.consulterProduits();
  }
  effacerFormulaire() {
    this.produitCourant = new Produit();

  }
  ajouterProduit(nouveau: Produit): void {

    this.produitsService.addProduit(nouveau).subscribe(
      {
        next: addedProduct => {
          console.log("Succès POST", addedProduct);
          this.nouveauProduit.push(nouveau);
          this.ajout = true;
          console.log("Ajout d'un nouveau produit: " + nouveau.designation);
        },
        error: err => {
          console.log("Erreur POST");
        }
      }
    )
  }
  async validerFormulaire(form: NgForm) {
    const ancienProduit = this.nouveauProduit.find(p => p.id === this.produitCourant.id);

    if (ancienProduit) {
      alert("Identificateur de produit déjà existant.");
    } else {
      this.ajouterProduit(this.produitCourant);
      this.produitCourant = new Produit();
      await alert("Produit créé.");
      this.router.navigate(['/products'])
    }
  }

}

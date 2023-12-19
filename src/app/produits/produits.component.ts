import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/protuit';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProduitsService } from '../services/produits.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})

export class ProduitsComponent implements OnInit {
  // produits: Array<Produit> = [
  //   { id: 1, code: 'x12', designation: "Panier plastique", prix: 20 },
  //   { id: 2, code: 'y4', designation: "table en bois", prix: 100 },
  //   { id: 3, code: 'y10', designation: "salon en cuir", prix: 3000 }
  // ];

  constructor(private http: HttpClient, private produitsService: ProduitsService) {

  }
  // ngOnInit(): void {
  //   console.log("Initialisation du composant: Récupérer la liste des produits");
  //   this.http.get<Array<Produit>>("http://localhost:9999/produits")
  //     .subscribe(
  //       {
  //         next: data => {
  //           console.log("Succès GET");
  //           this.produits = data;
  //         },
  //         error: err => {
  //           console.log("Erreur GET");
  //         }
  //       }
  //     )
  // }
  // validerFormulaire(form: NgForm) {
  //   const existingProductIndex = this.produits.findIndex((p) => p.id === form.value.id);

  //   if (existingProductIndex !== -1) {
  //     // Si l'ID existe, alors mode "update"
  //     this.mode = "update";

  //     // Mettre à jour le produit existant
  //     this.produits[existingProductIndex] = form.value;
  //     console.log("Produit mis à jour :", form.value);
  //   } else {
  //     // Si l'ID n'existe pas, alors mode "add"
  //     this.mode = "add";

  //     // Ajouter un nouveau produit à la liste
  //     this.produits.push(form.value);
  //     console.log("Nouveau produit ajouté :", form.value);
  //   }

  //   // Réinitialiser le formulaire et le mode après l'ajout/mise à jour
  //   this.effacerFormulaire();
  // }
  ngOnInit(): void {
    //Message affiché au moment de l'affichage du composant
    console.log("Initialisation du composant:.....");
    //charger les données
    this.consulterProduits();
  }
  produitCourant = new Produit();

  idExiste: boolean = false;
  isdesibled = false;
  produits: Produit[] = [];
  mode: string = "isNotEdit";

  validerFormulaire1(form: NgForm) {
    console.log(form.value);
    //this.produits.push(this.produitCourant);
    if (form.value.id != undefined) {
      console.log("id non vide...");
      //flag pour distinguer entre le mode AJOUT et le mode EDIT
      let nouveau: boolean = true;
      let index = 0;
      do {
        let p = this.produits[index];
        console.log(
          p.code + ' : ' + p.designation + ': ' + p.prix);
        if (p.id == form.value.id) {
          //rendre le mode à EDIT
          nouveau = false;
          console.log('ancien');
          let reponse: boolean =
            confirm("Produit existant. Confirmez vous la mise à jour de :" + p.designation + " ?");
          if (reponse == true) {
            //mettre à jour dans le BackEnd
            this.http.put<Array<Produit>>("http://localhost:9999/produits/" +
              form.value.id, form.value)
              .subscribe(
                {
                  next: updatedProduit => {
                    console.log("Succès PUT");
                    //mettre à jour le produit aussi dans le tableau "produits" (FrontEnd)
                    p.code = form.value.code;
                    p.designation = form.value.designation;
                    p.prix = form.value.prix;
                    console.log('Mise à jour du produit:'
                      + p.designation);
                  },
                  error: err => {
                    console.log("Erreur PUT");
                  }
                }
              )
          }
          else {
            console.log("Mise à jour annulée");
          }
          //Arrêter la boucle
          return;
        }
        else {
          //continuer à boucler
          index++;
        }
      }
      while (nouveau && index < this.produits.length);
      //en cas d'ajout
      if (nouveau) {
        console.log('nouveau');
        this.produits.push(form.value);
        console.log("Ajout d'un nouveau produit:" + form.value.designation);
      }
    }
    else {
      console.log("id vide...");
    }
  }


  effacerFormulaire() {
    this.produitCourant = new Produit();
    this.isdesibled = false
  }
  supprimerProduit1(p: Produit) {
    //Afficher une boite de dialogue pour confirmer la suppression
    let reponse: boolean = confirm("Voulez vous supprimer le produit :" + p.designation + " ?");
    if (reponse == true) {
      console.log("Suppression confirmée...");
      //chercher l'indice du produit à supprimer
      let index: number = this.produits.indexOf(p);
      console.log("indice du produit à supprimer: " + index);
      if (index !== -1) {
        // supprimer le produit référencé
        this.produits.splice(index, 1);
      }
    }
    else {
      console.log("Suppression annulée...");
    }
  }

  //with service
  consulterProduits() {
    console.log("Récupérer la liste des produits");
    //Appeler la méthode 'getProduits' du service pour récupérer les données du JSON
    this.produitsService.getProduits()
      .subscribe(
        {
          //En cas de succès
          next: data => {
            console.log("Succès GET");
            this.produits = data;
            console.log("Produits", this.produits)
          },
          //En cas d'erreur
          error: err => {
            console.log("Erreur GET");
          }
        }
      )
  }
  //without service
  // consulterProduits(): void {
  //   this.http.get<Produit[]>("http://localhost:9999/produits")
  //     .subscribe(
  //       {
  //         next: data => {
  //           console.log("Succès GET");
  //           this.produits = data;
  //         },
  //         error: err => {
  //           console.log("Erreur GET");
  //         }
  //       }
  //     )
  // }



  supprimerProduit(produit: Produit): void {
    let reponse: boolean = confirm("Voulez-vous supprimer le produit :" + produit.designation + " ?");
    if (reponse) {
      //  this.http.delete<void>("http://localhost:9999/produits/" + produit.id)
      this.produitsService.deleteProduit(produit.id)
        .subscribe(
          {
            next: () => {
              console.log("Suppression réussie");
              const index: number = this.produits.indexOf(produit);
              if (index !== -1) {
                this.produits.splice(index, 1);
              }
            },
            error: err => {
              console.log("Erreur DELETE");
            }
          }
        )
    } else {
      console.log("Suppression annulée");
    }
  }
  mettreAJourProduit(nouveau: Produit, ancien: Produit): void {

    //this.http.put<Produit>("http://localhost:9999/produits/" + ancien.id, nouveau)
    this.produitsService.updateProduit(ancien.id, nouveau)
      .subscribe(
        {
          next: updatedProduit => {
            console.log("Succès PUT");
            // Update the product in the frontend
            Object.assign(ancien, updatedProduit);
            console.log('Mise à jour du produit: ' + ancien.designation);
          },
          error: err => {
            console.log("Erreur PUT");
          }
        }
      )
  }
  editerProduit(p: Produit) {
    console.log("================================", this.isdesibled)
    this.isdesibled = true
    console.log("================================", this.isdesibled)
    this.mode = "edit"
    this.produitCourant = { ...p };
  }
  validerFormulaire(form: NgForm) {

    if (this.produitCourant.id !== undefined) {
      // Si l'ID est présent, c'est une mise à jour
      // Récupérer les détails du produit existant à partir de this.produits ou d'une autre source
      const ancienProduit = this.produits.find(p => p.id === this.produitCourant.id);

      if (ancienProduit) {

        this.mettreAJourProduit(this.produitCourant, ancienProduit);
        this.mode = 'isNotedit'

      }
    }
    this.isdesibled = false
    this.effacerFormulaire();
  }

}





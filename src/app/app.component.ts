
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-gestion-produits';


  actions: Array<any> = [

    { title: 'Acceuil', icone: 'bi bi-house', route: 'home' },
    { title: `listProduct`, icone: 'bi bi-list-ul', route: '/products' },
    { title: 'addProduct ', icone: 'bi bi-folder-plus ', route: 'addproduct', }

  ];
  actionCourante: any;
  setActionCourante(e: any) {
    this.actionCourante = e;
  }



}

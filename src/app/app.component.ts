import { Component } from '@angular/core';
import { Product } from './components/product/product_model';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  products: Product[] = []
  constructor(public firebase : FirebaseService){}

  ngOnInit():void{
      console.log("muie")
      this.firebase.getProducts().subscribe((rez  : Product[]) => {
          this.products = rez 
      })
  }
}

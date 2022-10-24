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
      this.firebase.getProducts().subscribe((rez  : Product[]) => {
          this.products = rez 
      })
  }
  message1: string;
  message2: string; 

  receiveMessage1($event : any) {
    this.message1 = $event
  }

  receiveMessage2($event : any) {
    this.message2 = $event
  }
}

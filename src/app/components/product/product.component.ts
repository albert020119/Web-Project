import { Component, OnInit, Input } from '@angular/core';
import {
  Firestore, addDoc, collection, collectionData,
  doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc, CollectionReference, DocumentData
} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() img_link: string;
  @Input() text: string;
  products : CollectionReference<DocumentData>;
  db : Firestore

  constructor() {
      this.db = getFirestore()
      this.products = collection(this.db,'products')
   }

  ngOnInit(): void {
  }

  addProduct(name : string, image : string, price: string){
      return addDoc(this.products, {
        name: name,
        image: image,
        price: price
      })
  }

}

import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {
  Firestore, addDoc, collection, collectionData,
  doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc, CollectionReference, DocumentData
} from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { ProductComponent } from '../components/product/product.component';
import { Product } from '../components/product/product_model';
import { Admin } from './admin_model';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false
  user_database : AngularFirestoreCollection<any[]>;
  products : CollectionReference<DocumentData>;
  db : Firestore
  constructor(public firebaseAuth: AngularFireAuth, public database : AngularFirestore){
      // this.db = getFirestore()
      // this.products = collection(this.db, "products")
      console.log(this.user_database)
  }

  async signin(email: string, password: string)
  {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
    .then(res =>{
      alert("sign in succes")
      this.isLoggedIn=true
      localStorage.setItem('user',JSON.stringify(res.user))
    }, err => {
      alert(err.message)
      console.log(err.message)
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
    
  }

  sendResetMail(email : string){
    this.firebaseAuth.sendPasswordResetEmail(email)
  }

  async signup(email: string, password: string)
  {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
    .then(res =>{
      this.isLoggedIn=true
      localStorage.setItem('user',JSON.stringify(res.user))
    })
  }

  logout(){
    this.firebaseAuth.signOut()
    localStorage.removeItem('user')
  }

  async addProduct(name : string, image : string, price : string){
    console.log('adding product to database')
    this.db = getFirestore()
    this.products = collection(this.db, "products")
    try {
    await addDoc(this.products, {
      name: name,
      image: image,
      price: price
    }).then(res => {
        console.log("success")
    })
    .catch(function(error) {
        console.log("error occured")
        console.log(error.message)
    })}
    catch (err){
      console.log(err)
    }
    return
  }

  async removeProduct(name : string){
    this.db = getFirestore()
    this.products = collection(this.db, "products")
    console.log("Removing item from database")
    this.getProducts().subscribe((rez : Product[]) => {
      rez.forEach(item =>{
        if (item.name === name){
          console.log(item)
          var doc_to_delete = doc(this.db, `products/${item.id}`)
          deleteDoc(doc_to_delete)
        }
      })
      
    })
  }

  getProducts() : Observable<Product[]>{
    this.db = getFirestore()
    this.products = collection(this.db, "products")
    return collectionData(this.products, {idField:"id"}) as Observable<Product[]>
  }

  getAdmins() : Observable<Admin[]>{
    this.db = getFirestore()
    this.products = collection(this.db, "admins")
    return collectionData(this.products, {idField:"id"}) as Observable<Admin[]>
  }
}

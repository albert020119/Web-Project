import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {
  Firestore, addDoc, collection, collectionData,
  doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc, CollectionReference, DocumentData
} from '@angular/fire/firestore';
import { ResolveStart } from '@angular/router';
import { getFirestore } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { ProductComponent } from '../components/product/product.component';
import { Product } from '../components/product/product_model';
import { Admin } from './admin_model';
import { CartItem } from './cartItem_model';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false
  user_database : AngularFirestoreCollection<any[]>;
  products : CollectionReference<DocumentData>;
  db : Firestore

  mail = "" 
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
      if (res.user?.email){
        this.mail = res.user.email
      }
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

  async addToCart(name: string , image: string, price: string){
    console.log('adding cart item to database')
    this.db = getFirestore()
    this.products = collection(this.db, "carts")
    try {
    await addDoc(this.products, {
      name: name,
      image: image,
      price: price,
      mail: this.mail
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

  async addOrder(item : CartItem){
    console.log('adding order item to database')
    this.db = getFirestore()
    this.products = collection(this.db, "orders")
    try {
    await addDoc(this.products, item).then(res => {
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
  
  async removeItemFromCart(item_to_delete : CartItem){
    this.db = getFirestore()
    this.products = collection(this.db, "carts")
    this.getCart().subscribe((rez : CartItem[]) => {
      rez.forEach(item =>{
        console.log(item)
        if (item.name == item_to_delete.name && item.image == item_to_delete.image && item.price == item_to_delete.price){
          console.log(item)
          var doc_to_delete = doc(this.db, `carts/${item.id}`)
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

  getCart() : Observable<CartItem[]>{
    this.db = getFirestore()
    this.products = collection(this.db, "carts")
    return collectionData(this.products, {idField:"id"}) as Observable<CartItem[]>
  }

  getOrders() : Observable<CartItem[]>{
    this.db = getFirestore()
    this.products = collection(this.db, "orders")
    return collectionData(this.products, {idField:"id"}) as Observable<CartItem[]>
  }

  getAdmins() : Observable<Admin[]>{
    this.db = getFirestore()
    this.products = collection(this.db, "admins")
    return collectionData(this.products, {idField:"id"}) as Observable<Admin[]>
  }
}

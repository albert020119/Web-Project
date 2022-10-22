import { Component, OnInit, Input } from '@angular/core';
import { NgModule } from '@angular/core'
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FirebaseService } from 'src/app/services/firebase.service'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ThisReceiver } from '@angular/compiler';
import { ProductComponent } from '../product/product.component';



@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(public firebaseService : FirebaseService) { 
    this.productForm = true
  }

  isDisplay = true
  isLoggedIn = false
  productForm = true
  uid = ""
  mail = "asd"

  ngOnInit(): void {
      if (localStorage.getItem("user")!== null)
      this.isLoggedIn = true
      else 
      this.isLoggedIn = false

      this.productForm = true
  }

  showlogin(){
    this.isDisplay=!this.isDisplay
  }

  showProductForm(){
    console.log("asd")
    this.productForm = !this.productForm
  }

  async onLogin(event : Event, email : string, password : string)
  {
      event.preventDefault()
      await this.firebaseService.signin(email, password)
      if (this.firebaseService.isLoggedIn){
        this.handleLogIn()
        this.isLoggedIn = true
        this.showlogin()
      }
  }


  async onRegister(event : Event, email : string, password : string)
  {
      event.preventDefault()
      console.log(email)
      console.log(password)
      await this.firebaseService.signup(email, password)
      console.log(this.firebaseService.isLoggedIn)
      if (this.firebaseService.isLoggedIn)
        this.handleLogIn()
        this.isLoggedIn = true
        this.showlogin()
      console.log("after register")
  }

  async logout(){
    this.firebaseService.logout()
    this.isLoggedIn=false
  }

  handleLogIn(){
    const auth = getAuth()
    const user = auth.currentUser;
    if (user!==null){
      var mail = user.email
      if (mail!==null){
        this.mail = mail 
      }
    }
  }

  addProductToDatabase(name : string, image : string, price : string){
    this.firebaseService.addProduct(name, image, price)
  }

  getMail(){
    return this.mail
  }
}

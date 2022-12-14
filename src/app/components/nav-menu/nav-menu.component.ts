import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgModule } from '@angular/core'
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FirebaseService } from 'src/app/services/firebase.service'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ThisReceiver } from '@angular/compiler';
import { ProductComponent } from '../product/product.component';
import { Admin } from 'src/app/services/admin_model';
import { CartItem } from 'src/app/services/cartItem_model';



@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  @Output() messageEvent1 = new EventEmitter<boolean>();
  @Output() messageEvent2 = new EventEmitter<boolean>();

  sendMessage1(msg : boolean) {
    this.messageEvent1.emit(msg)
  }

  sendMessage2(msg : boolean) {
    this.messageEvent2.emit(msg)
  }

  constructor(public firebaseService : FirebaseService) { 
    this.sendMessage1(false)
    //this.sendMessage2(false)
    this.resetPassView = false
    this.productForm = true
  }

  resetPassView = false
  isDisplay = true
  isLoggedIn = false
  isAdmin = false 
  productForm = true
  showCartDiv = false
  showOrdersDiv = false
  order =  {}
  subtotal = 0.0
  uid = ""
  total : string
  mail = "asd"
  cart : CartItem[]

  ngOnInit(): void {
      if (localStorage.getItem("user")!== null)
      this.isLoggedIn = true
      else 
      this.isLoggedIn = false

      if (localStorage.getItem("admin")!== null){
          this.sendMessage2(true)
          this.isAdmin = true
      }
      else{
        this.isAdmin = false
      }
      this.resetPassView = false  
      this.productForm = true
  }


  showlogin(){
    this.isDisplay=!this.isDisplay
  }

  showProductForm(){
    console.log("asd")
    this.productForm = !this.productForm
  }

  resetPassword(){
      this.firebaseService.sendResetMail(this.getMail())
      this.resetPassView = true
  }

  hideReset(){
    this.resetPassView = !this.resetPassView
  }

  async onLogin(event : Event, email : string, password : string)
  {
      event.preventDefault()
      await this.firebaseService.signin(email, password)
      if (this.firebaseService.isLoggedIn){
        this.getCart()
        this.sendMessage1(true)
        this.handleLogIn()
        this.isLoggedIn = true
        this.showlogin()
      }
  }

  async onAdminLogin(event : Event, email : string, password: string){
    console.log(this.isAdmin)
    // this.sendMessage2(true)
    // this.setAdmin()
    this.firebaseService.getAdmins().subscribe((rez : Admin[]) => {
      rez.forEach(item => {
        console.log(item)
        if (item.email == email && item.password == password){
          this.sendMessage2(true)
          this.setAdmin()
        }
      })
      })
  }

  showCart(){
    console.log("showing cart")
    this.getCart()
    this.showCartDiv = true
  }

  hideCart(){
    this.showCartDiv = false 
  }

  hideOrders(){
    this.showOrdersDiv = false 
  }

  getCart(){
    this.cart = []
    this.subtotal = 0
    this.total = ""  
    this.firebaseService.getCart().subscribe((rez : CartItem[]) => {
      rez.forEach(item =>{
        console.log(item)
        if (item.mail === this.getMail()){
          console.log(typeof(item.price))
          console.log(parseFloat(item.price))
          if(!isNaN(parseFloat(item.price))) {
            console.log(parseFloat(item.price))
            this.subtotal = this.subtotal + parseFloat(item.price)
          }
          console.log("pushing to array")
          this.cart.push(item)
        }
      })
      this.total = this.subtotal.toFixed(2)
      
    })
    this.total = this.subtotal.toFixed(2)
  }

  removeItemFromCart(item : CartItem){
      console.log("Removing item from cart")
      this.firebaseService.removeItemFromCart(item)
      this.hideCart()
  }

  onCheckout(){
    let i = 0  
    this.cart.forEach(item => {
        this.firebaseService.addOrder(item)
        this.firebaseService.removeItemFromCart(item)
    })
  }

  showOrders(){
      this.getOrders()
      this.showOrdersDiv = true
  }

  getOrders(){
    this.cart = []
    this.subtotal = 0
    this.total = ""
    this.firebaseService.getOrders().subscribe((rez : CartItem[]) => {
      rez.forEach(item =>{
        console.log(item)
          console.log(typeof(item.price))
          console.log(parseFloat(item.price))
          if(!isNaN(parseFloat(item.price))) {
            console.log(parseFloat(item.price))
            this.subtotal = this.subtotal + parseFloat(item.price)
          }
          console.log("pushing to array")
          this.cart.push(item)
      })
      this.total = this.subtotal.toFixed(2)
      
    })
    this.total = this.subtotal.toFixed(2)
  }

  setAdmin(){
    localStorage.setItem('admin','1')
    this.isAdmin = !this.isAdmin
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
    this.sendMessage1(false)
    this.sendMessage2(false)
    localStorage.clear()
    this.isLoggedIn=false
    this.isAdmin=false
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

  handleAdminLogIn(){
    console.log("logged in as admin succesfully")
    this.isAdmin = true
  }

  async addProductToDatabase(name : string, image : string, price : string){
     await this.firebaseService.addProduct(name, image, price)
  }

  removeProductFromDatabase(name : string){
    this.firebaseService.removeProduct(name)
  }

  getMail(){
    return this.mail
  }
}

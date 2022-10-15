import { Component, OnInit, Input } from '@angular/core';
import { NgModule } from '@angular/core'
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FirebaseService } from 'src/app/services/firebase.service'
import { BrowserTransferStateModule } from '@angular/platform-browser';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(public firebaseService : FirebaseService) { 
  }

  isDisplay = true
  isLoggedIn = false

  ngOnInit(): void {
      if (localStorage.getItem("user")!== null)
      this.isLoggedIn = true
      else 
      this.isLoggedIn = false
  }

  showlogin(){
    this.isDisplay=!this.isDisplay
  }

  async onLogin(event : Event, email : string, password : string)
  {
      event.preventDefault()
      await this.firebaseService.signin(email, password)
      if (this.firebaseService.isLoggedIn)
        this.isLoggedIn = true
        this.showlogin()
  }

  async onRegister(event : Event, email : string, password : string)
  {
      event.preventDefault()
      console.log(email)
      console.log(password)
      await this.firebaseService.signup(email, password)
      console.log(this.firebaseService.isLoggedIn)
      if (this.firebaseService.isLoggedIn)
        this.isLoggedIn = true
        this.showlogin()
      console.log("after register")
  }

}

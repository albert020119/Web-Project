import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false
  constructor(public firebaseAuth: AngularFireAuth){

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
}

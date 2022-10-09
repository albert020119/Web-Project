import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { AngularFireModule } from '@angular/fire/compat'
import { FirebaseService } from './services/firebase.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    NavMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDgHvFAqAImbQh9IFYPJWu8rE9iK3oV95s",
      authDomain: "project-wp-f71f3.firebaseapp.com",
      projectId: "project-wp-f71f3",
      storageBucket: "project-wp-f71f3.appspot.com",
      messagingSenderId: "123318577699",
      appId: "1:123318577699:web:ca07b1e03502d7306c9f96"
    })
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }

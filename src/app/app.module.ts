import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { AngularFireModule } from '@angular/fire/compat';
import { FirebaseService } from './services/firebase.service';
import { environment } from 'src/environments/environment';
import { ProductComponent } from './components/product/product.component';



@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    NavMenuComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }

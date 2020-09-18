import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GeneralLayoutComponent } from './layout/general-layout/general-layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import {AuthService} from './auth.service';
import {JwtInterceptor} from './JwtInterceptor';
import {ApiService} from './api.service';
import { RestaurantComponent } from './restaurant/restaurant.component';

const appRoutes: Routes = [
  {
    path: '',
    component: GeneralLayoutComponent,
    children: [
      {path: '', component: RestaurantComponent},
    ],
    canActivate: [AuthGuard]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    GeneralLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    RestaurantComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    RouterModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    ApiService,
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

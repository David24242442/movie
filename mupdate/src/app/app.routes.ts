import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { MainhomeComponent }  from './mainhome/mainhome.component';
import { MoviespageComponent } from './moviespage/moviespage.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    {path: 'signin', component: SigninComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'home', component: MainhomeComponent},
    {path: 'movies', component: MoviespageComponent}
]

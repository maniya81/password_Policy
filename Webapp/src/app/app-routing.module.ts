import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChangePasswordComponent } from './modules/auth/pages/change-password/change-password.component';
import { ForgotPasswordComponent } from './modules/auth/pages/forgot-password/forgot-password.component';
import { RegisterComponent } from './modules/auth/pages/register/register.component';
import { ResetPasswordComponent } from './modules/auth/pages/reset-password/reset-password.component';
import { SigninComponent } from './modules/auth/pages/signin/signin.component';
import { AuthGuard } from './modules/core/guards/auth.guard';
import { PasswordComponent } from './modules/user/pages/password/password.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'signin' },
  {
    path: '',
    loadChildren: () =>
    import('./modules/auth/auth.module').then((m) => m.AuthModule), // Lazy load account module
    data: { preload: true },
  },
  
  {
    path: 'app',
    loadChildren: () =>
    import('./modules/user/user.module').then((m) => m.UserModule), // Lazy load user module
    data: { preload: true },
    canActivate : [AuthGuard]
  },

  // { path: 'password', component: PasswordComponent},
  // { path: 'signin', component: SigninComponent },
  // { path: 'register', component: RegisterComponent },
  // { path: 'forgotpassword', component: ForgotPasswordComponent },
  // { path: 'resetpassword', component: ResetPasswordComponent },
  // { path: 'changepassword', component: ChangePasswordComponent },
  { path: '**', redirectTo: 'signin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { PasswordComponent } from 'src/app/modules/user/pages/password/password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SigninComponent } from './pages/signin/signin.component';
import { IsLoggedInGuard } from '../core/guards/isLoggedIn.guard';



@NgModule({
  imports: [
      RouterModule.forChild([
          {
              path: '',
              component: AuthComponent,
              children: [
                // { path: 'password', component: PasswordComponent},
                { path: 'signin', component: SigninComponent, canActivate: [IsLoggedInGuard] },
                { path: 'register', component: RegisterComponent },
                { path: 'forgotpassword', component: ForgotPasswordComponent },
                { path: 'resetpassword', component: ResetPasswordComponent },
                { path: 'changepassword', component: ChangePasswordComponent },
                // { path: '**', redirectTo: 'signin' }
              ]
          }
      ])
  ],
  exports: [
      RouterModule
  ]
})
export class AuthRoutingModule { }

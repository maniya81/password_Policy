import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth/auth.service';
import { SessionHelperService } from '../shared/helpers/session-helper.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  currentUserName ='';
  constructor(
    private authServcie: AuthService,
    private router: Router,
    private session: SessionHelperService
  ) { }

  ngOnInit(): void {
    this.currentUserName = this.authServcie.getUserName();
    setInterval(x => {
      this.session.checkSession();
    }, 1000);
  }
  logOut(){
    console.log('logOut');
    this.authServcie.logout();
    this.router.navigate(['/signin']);
    
  }
  changePassword(){
    console.log('ChangePassword');
    this.router.navigate(['app/changepassword', { email: this.authServcie.getUserEmailId() }]);
  }

}

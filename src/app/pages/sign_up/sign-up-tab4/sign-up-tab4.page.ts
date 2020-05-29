import { AuthService } from 'src/app/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersDataFetchService } from 'src/app/services/users-data-fetch/users-data-fetch.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up-tab4',
  templateUrl: './sign-up-tab4.page.html',
  styleUrls: ['./sign-up-tab4.page.scss'],
})
export class SignUpTab4Page implements OnInit {

  private name: string;

  constructor(private router: Router, private userDataFetch: UsersDataFetchService, private authService: AuthService) {
    this.authService.getUserUID().subscribe(async (uid) => {
      this.name = await this.userDataFetch.firestore_getName(uid);
    });
  }

  ngOnInit() {
  }

  saveName() {
    this.authService.getUserUID().subscribe(async (uid) => {
      await this.userDataFetch.firestore_setName(uid, this.name);
      this.router.navigate(['/map-start']);
    });
  }

}

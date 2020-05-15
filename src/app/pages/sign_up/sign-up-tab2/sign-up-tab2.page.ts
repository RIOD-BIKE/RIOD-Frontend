import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';


@Component({
  selector: 'app-sign-up-tab2',
  templateUrl: './sign-up-tab2.page.html',
  styleUrls: ['./sign-up-tab2.page.scss'],
})
export class SignUpTab2Page implements OnInit {

  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.Germany, CountryISO.Austria, CountryISO.Switzerland];
	phoneForm = new FormGroup({
		phone: new FormControl(undefined, [Validators.required])
	});

  constructor(private router: Router) { }

  ngOnInit() {
  }

  DEMONextPage(){
    console.log(this.phoneForm.controls["phone"].valid);
    if (!this.phoneForm.valid) {
      alert("Telefonnummer nicht gültig!" + this.phoneForm.errors);
    } else {
      // TODO: Code von Firebase anfragen und ggf. weiterleiten
      this.router.navigate(['/sign-up-tab3']);
    }
  }
}

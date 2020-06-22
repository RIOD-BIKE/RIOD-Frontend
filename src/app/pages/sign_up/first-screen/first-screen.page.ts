import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExplainSlidesComponent } from 'src/app/Components/explain-slides/explain-slides.component';

@Component({
  selector: 'app-first-screen',
  templateUrl: './first-screen.page.html',
  styleUrls: ['./first-screen.page.scss'],
})
export class FirstScreenPage implements OnInit {

  constructor(private modalController: ModalController, private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    const isLoggedIn = await this.authService.isLoggedIn();
    isLoggedIn ? this.router.navigate(['map-start']) : this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ExplainSlidesComponent
    });
    return await modal.present();
  }

}


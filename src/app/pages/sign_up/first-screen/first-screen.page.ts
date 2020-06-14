import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExplainSlidesComponent } from 'src/app/Components/explain-slides/explain-slides.component';

@Component({
  selector: 'app-first-screen',
  templateUrl: './first-screen.page.html',
  styleUrls: ['./first-screen.page.scss'],
})
export class FirstScreenPage implements OnInit {

  constructor(private modalController: ModalController ) { }

  ngOnInit() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ExplainSlidesComponent
    });
    return await modal.present();
  }

}


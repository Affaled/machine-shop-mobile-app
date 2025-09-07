import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonSpinner,
  ModalController,
  AlertController,
} from '@ionic/angular/standalone';
import { WorkService } from 'src/app/services/work.service';
import { Work } from 'src/app/models/work.model';
import { WorkFormModal } from './work-form.modal';

@Component({
  selector: 'app-works',
  templateUrl: './work.page.html',
  styleUrl: './work.page.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSpinner,
  ],
})
export class WorkPage implements OnInit {
  searchTerm = signal('');
  loading: boolean = false;

  constructor(
    private workService: WorkService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  public readonly works$ = this.workService.work$;

  filteredWorks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const works = this.works$();

    if (!term) return works;

    return works.filter((w) => w.name.toLowerCase().includes(term));
  });

  async deleteWork(work: Work) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o serviço ${work.name}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: async () => {
            await this.workService.deleteWork(work.id);
          },
        },
      ],
    });
    await alert.present();
  }

  async refresh(event: any) {
    event.target.complete();
  }

  async openModal(work?: Work) {
    const modal = await this.modalController.create({
      component: WorkFormModal,
      cssClass: 'sheet-modal',
      animated: true,
      backdropDismiss: true,
      initialBreakpoint: 1,
      breakpoints: [0, 0.4, 0.6, 0.8, 1],
      componentProps: { work },
    });

    modal.onDidDismiss().then(() => {});

    return await modal.present();
  }

  ngOnInit() {}
}

import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonCardSubtitle,
  ModalController,
} from '@ionic/angular/standalone';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { AlertController } from '@ionic/angular';
import { CustomerService } from 'src/app/services/customer.service';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { Customer } from 'src/app/models/customer.model';
import { MotorcycleFormModal } from './motorcylcle-form.modal';

@Component({
  selector: 'app-motorcycle',
  templateUrl: './motorcycle.page.html',
  styleUrls: ['./motorcycle.page.scss'],
  standalone: true,
  imports: [
    IonCardSubtitle,
    IonSpinner,
    IonRefresherContent,
    IonRefresher,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonList,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonSearchbar,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class MotorcyclePage implements OnInit {
  searchTerm = signal('');
  loading: boolean = false;

  async ngOnInit() {}

  constructor(
    private motorcycleService: MotorcycleService,
    private alertController: AlertController,
    private customerService: CustomerService,
    private modalController: ModalController
  ) {}

  public readonly customers$ = this.customerService.customer$;
  motorcycles$ = this.motorcycleService.motorcycles$;

  filteredMotorcycles = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const motorcycles = this.motorcycles$();

    if (!term) {
      return motorcycles;
    }

    return motorcycles.filter(
      (motorcycle) =>
        motorcycle.model.toLowerCase().includes(term) ||
        motorcycle.plate.toLowerCase().includes(term) ||
        this.getCustomerName(motorcycle.customerId).toLowerCase().includes(term)
    );
  });

  getCustomerName(customerId: string): string {
    return (
      this.customers$().find((c) => c.id === customerId)?.name ||
      'Cliente não encontrado'
    );
  }

  async deleteMotorcycle(motorcycle: Motorcycle) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a moto ${motorcycle.model} (Placa: ${motorcycle.plate})?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: async () => {
            await this.motorcycleService.deleteMotorcycle(motorcycle.id);
          },
        },
      ],
    });
    await alert.present();
  }

  async refresh(event: any) {
    event.target.complete();
  }

  async openModal(motorcycle?: Motorcycle) {
    const modal = await this.modalController.create({
      component: MotorcycleFormModal,
      cssClass: 'sheet-modal',
      animated: true,
      backdropDismiss: true,
      initialBreakpoint: 1,
      breakpoints: [0, 0.4, 0.6, 0.8, 1],
      handleBehavior: 'cycle',
      componentProps: { motorcycle }, // <-- passa a moto
    });

    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }
}

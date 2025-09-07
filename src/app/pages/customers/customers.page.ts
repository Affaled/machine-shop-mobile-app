import { Component, computed, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
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
  AlertController
} from "@ionic/angular/standalone";

import { CustomerService } from "src/app/services/customer.service";
import { Customer } from "src/app/models/customer.model";
import { CustomerFormModal } from "./customers-form.modal";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrl: './customers.page.scss',
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
    IonSpinner
  ]
})
export class CustomersPage implements OnInit {
  searchTerm = signal('');
  loading: boolean = false;

  constructor(
    private customerService: CustomerService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  public readonly customers$ = this.customerService.customer$;

  filteredCustomers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const customers = this.customers$();

    if (!term) return customers;

    return customers.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term)
    );
  });

  async deleteCustomer(customer: Customer) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o cliente ${customer.name}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: async () => {
            await this.customerService.deleteCustomer(customer.id);
          }
        }
      ]
    });
    await alert.present();
  }

  async refresh(event: any) {
    event.target.complete();
  }

  async openModal(customer?: Customer) {
    const modal = await this.modalController.create({
      component: CustomerFormModal,
      cssClass: 'sheet-modal',
      animated: true,
      backdropDismiss: true,
      initialBreakpoint: 1,
      breakpoints: [0, 0.4, 0.6, 0.8, 1],
      componentProps: { customer } 
    });

    modal.onDidDismiss().then(() => {

    });

    return await modal.present();
  }

  ngOnInit() {}
}

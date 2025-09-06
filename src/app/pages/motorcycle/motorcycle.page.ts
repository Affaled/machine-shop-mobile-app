import { Component, OnInit } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { MotorcycleRepository } from 'src/app/repositories/motorcycle.repository';
import { AlertController } from '@ionic/angular';
import { CustomerRepository } from 'src/app/repositories/customer.repository';
import { Motorcycle } from 'src/app/models/motorcycle.model';

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
  motorcycles: Motorcycle[] = [];
  filteredMotorcycles: Motorcycle[] = [];
  customers: any[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  async ngOnInit() {
    await this.loadData();
  }

  constructor(
    private motorcycleRepository: MotorcycleRepository,
    private alertController: AlertController,
    private customerRepository: CustomerRepository
  ) {}

  async loadData() {
    this.loading = true;
    try {
      [this.motorcycles, this.customers] = await Promise.all([
        this.motorcycleRepository.getAllMotorcycles(),
        this.customerRepository.getAllCustomers(),
      ]);
      this.filteredMotorcycles = [...this.motorcycles];
    } finally {
      this.loading = false;
    }
  }

  filterMotorcycles() {
    if (!this.searchTerm.trim()) {
      this.filteredMotorcycles = [...this.motorcycles];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredMotorcycles = this.motorcycles.filter(
      (motorcycle) =>
        motorcycle.model.toLowerCase().includes(term) ||
        motorcycle.plate.toLowerCase().includes(term) ||
        this.getCustomerName(motorcycle.customerId).toLowerCase().includes(term)
    );
  }

  getCustomerName(customerId: number): string {
    return (
      this.customers.find((c) => c.id === customerId)?.name ||
      'Cliente não encontrado'
    );
  }

  async refresh(event: any) {
    await this.loadData();
    event.target.complete();
  }

  async addMotorcycle() {
    const customers = await this.customerRepository.getAllCustomers();

    const alert = await this.alertController.create({
      header: 'Adicionar Moto',
      inputs: [
        {
          name: 'customerId',
          type: 'radio' as const,
          label: 'Cliente',
          value: customers[0]?.id,
          checked: true,
        },
        ...customers.map((customer) => ({
          name: 'customerId',
          type: 'radio' as const,
          label: customer.name,
          value: customer.id,
        })),
        {
          name: 'model',
          type: 'text',
          placeholder: 'Modelo',
        },
        {
          name: 'plate',
          type: 'text',
          placeholder: 'Placa',
        },
        {
          name: 'year',
          type: 'number',
          placeholder: 'Ano',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Adicionar',
          handler: (data) => {
            if (data.model && data.plate && data.customerId) {
              this.motorcycleRepository.createMotorcycle(data);
            }
          },
        },
      ],
    });
    await alert.present();
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
            await this.motorcycleRepository.deleteMotorcycle(motorcycle.id);
            await this.loadData();
          },
        },
      ],
    });
    await alert.present();
  }
}

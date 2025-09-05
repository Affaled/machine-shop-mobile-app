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
} from '@ionic/angular/standalone';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { AlertController } from '@ionic/angular';
import { CustomerRepository } from 'src/app/repositories/customer.repository';

@Component({
  selector: 'app-motorcycle',
  templateUrl: './motorcycle.page.html',
  styleUrls: ['./motorcycle.page.scss'],
  standalone: true,
  imports: [
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
export class MotorcyclePage {
  constructor(
    private motorcycleService: MotorcycleService,
    private alertController: AlertController,
    private customerRepository: CustomerRepository
  ) {}

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
              this.motorcycleService.createMotorcycle(data);
            }
          },
        },
      ],
    });
    await alert.present();
  }
}

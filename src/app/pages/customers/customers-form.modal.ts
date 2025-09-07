import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Customer } from 'src/app/models/customer.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { CustomerService } from 'src/app/services/customer.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';

@Component({
  selector: 'app-customer-form-modal',
  templateUrl: './customers-form.modal.html',
  styleUrl: './customers-form.modal.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    IonList,
  ],
})
export class CustomerFormModal {
  customer?: Customer;

  isEdit = signal(false);
  form: FormGroup;
  motorcyclesCustomer = signal<Motorcycle[]>([]);

  public readonly customers$ = this.customerService.customer$;
  motorcycles$ = this.motorcycleService.motorcycles$;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private customerService: CustomerService,
    private motorcycleService: MotorcycleService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  async ngOnInit() {
    if (this.customer) {
      this.isEdit.set(true);
      this.form.patchValue({
        name: this.customer.name,
        phone: this.customer.phone,
      });

      const allMotos = await this.motorcycles$();
      this.motorcyclesCustomer.set(
        allMotos.filter((m) => m.customerId === this.customer?.id)
      );
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async createOrUpdate() {
    if (!this.form.valid) return;

    const fv = this.form.getRawValue();
    const record: Customer = {
      id: this.customer?.id || crypto.randomUUID(),
      name: fv.name,
      phone: fv.phone,
    };
    if (this.isEdit()) await this.customerService.updateCustomer(record);
    else await this.customerService.addCustomer(record);

    this.closeModal();
  }
}

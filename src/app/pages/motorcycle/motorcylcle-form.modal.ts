import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular/standalone';
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
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { CustomerService } from 'src/app/services/customer.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';

@Component({
  selector: 'app-order-item-form-modal',
  templateUrl: './motorcylcle-form.modal.html',
  styleUrl: './motorcylcle-form.modal.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonButton,
    IonContent,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonList,
  ],
})
export class MotorcycleFormModal {
  @Input() id?: string;
  @Input() motorcycle?: Motorcycle;

  form: FormGroup;
  isEdit = signal(false);
  currentYear = new Date();
  public readonly customers$ = this.customerService.customer$;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private motorcycleService: MotorcycleService,
    private customerService: CustomerService,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      customerId: ['', Validators.required],
      model: ['', [Validators.required]],
      plate: ['', [Validators.required]],
      year: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    if (this.motorcycle) {
      this.isEdit.set(true);
      this.form.patchValue(this.motorcycle);
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async createOrUpdate() {
    if (!this.form.valid) return;
    const fv = this.form.getRawValue();
    const entity: Motorcycle = {
      id: this.id ?? crypto.randomUUID(),
      customerId: fv.customerId,
      model: fv.model!,
      plate: fv.plate ?? undefined,
      year: Number(fv.quantity ?? 0),
    };

    if (this.isEdit()) await this.motorcycleService.updateMotorcycle(entity);
    else await this.motorcycleService.createMotorcycle(entity);
    this.closeModal();
  }
}

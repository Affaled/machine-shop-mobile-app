import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { add, cash, close, cube, pricetag, save } from 'ionicons/icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { 
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form-modal',
  templateUrl: './product-form.modal.html',
  styleUrl: './product-form.modal.scss',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonRow,
    IonTitle,
    IonToolbar,
  ]
})
export class ProductFormModal {
  @Input() product?: Product;

  isEdit = signal(false);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private productService: ProductService
  ) {
    addIcons({ add, cash, close, cube, pricetag, save });
    this.form = this.fb.group({
      name: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    if (this.product) {
      this.isEdit.set(true);
      this.form.patchValue({
        name: this.product.name,
        stock: this.product.stock ?? 0,
        price: this.product.price
      });
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async createOrUpdate() {
    if (!this.form.valid) return;

    const fv = this.form.getRawValue();
    const record: Product = {
      id: this.product?.id || crypto.randomUUID(),
      name: fv.name,
      stock: fv.stock,
      price: fv.price
    };

    if (this.isEdit()) {
      await this.productService.updateProduct(record);
    } else {
      await this.productService.addProduct(record);
    }

    this.closeModal();
  }
}

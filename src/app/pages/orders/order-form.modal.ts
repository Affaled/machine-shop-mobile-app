import { CommonModule } from '@angular/common';
import { Component, Input, signal, computed, effect } from '@angular/core';
import { addIcons } from 'ionicons';
import { add, car, cash, checkmarkCircle, close, construct, cube, person, save } from 'ionicons/icons';
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
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Order } from 'src/app/models/order.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { CustomerService } from 'src/app/services/customer.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { ProductService } from 'src/app/services/product.service';
import { WorkService } from 'src/app/services/work.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-form-modal',
  templateUrl: './order-form.modal.html',
  styleUrl: './order-form.modal.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
  ],
})
export class OrderFormModal {
  @Input() order?: Order;

  form: FormGroup;
  isEdit = signal(false);
  private selectedCustomerId = signal<string>('');

  public readonly motorcycles$ = this.motorcycleService.motorcycles$;
  public readonly customers$ = this.customerService.customer$;
  public readonly products$ = this.productService.products$;
  public readonly works$ = this.workService.work$;

  private allMotorcycles = signal<Motorcycle[]>([]);

  public readonly customerMotorcycles$ = computed(() => {
    const customerId = this.selectedCustomerId();
    return this.allMotorcycles().filter((m) => m.customerId === customerId);
  });

  private selectedServiceIds = signal<string[]>([]);
  private selectedProductIds = signal<string[]>([]);

  public readonly selectedServices = computed(() => {
    const serviceIds = this.selectedServiceIds();
    return this.works$().filter((w) => serviceIds.includes(w.id));
  });

  public readonly selectedProducts = computed(() => {
    const productIds = this.selectedProductIds();
    return this.products$().filter((p) => productIds.includes(p.id));
  });

  public readonly totalPrice = computed(() => {
    const servicesTotal = this.selectedServices().reduce(
      (sum, service) => sum + service.price,
      0
    );
    const productsTotal = this.selectedProducts().reduce(
      (sum, product) => sum + product.price,
      0
    );
    return servicesTotal + productsTotal;
  });

  public readonly isCustomerSelected = computed(() => {
    return this.selectedCustomerId() != null;
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private motorcycleService: MotorcycleService,
    private productService: ProductService,
    private workService: WorkService,
    private orderService: OrderService,
    private alertCtrl: AlertController
  ) {
    addIcons({ add, car, cash, checkmarkCircle, close, construct, cube, person, save });
    this.form = this.fb.group({
      customerId: ['', Validators.required],
      motorcycleId: ['', Validators.required],
      status: ['pending', Validators.required],
      serviceIds: [[]],
      productIds: [[]],
    });

    effect(() => {
      this.allMotorcycles.set(this.motorcycleService.motorcycles$());
    });
  }

  async ngOnInit() {
    this.allMotorcycles.set(this.motorcycles$());

    if (this.order) {
      this.isEdit.set(true);

      const serviceIds = this.order.services?.map((s) => s.id) || [];
      const productIds = this.order.products?.map((p) => p.id) || [];

      this.selectedServiceIds.set(serviceIds);
      this.selectedProductIds.set(productIds);

      this.form.patchValue({
        customerId: this.order.customerId,
        motorcycleId: this.order.motorcycleId,
        status: this.order.status,
        serviceIds: serviceIds,
        productIds: productIds,
      });

      this.selectedCustomerId.set(this.order.customerId);
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  onCustomerChange(event: any) {
    const customerId = event.detail.value;
    if (customerId && customerId !== '')
      this.form.get('motorcycleId')?.enable();
    else this.form.get('motorcycleId')?.disable();

    this.selectedCustomerId.set(customerId || '');
    this.form.patchValue({ motorcycleId: '' });
  }

  onServicesChange(event: any) {
    const selectedIds = event.detail.value || [];
    this.selectedServiceIds.set(selectedIds);
  }

  onProductsChange(event: any) {
    const selectedIds = event.detail.value || [];
    this.selectedProductIds.set(selectedIds);
  }

  removeService(serviceId: string) {
    const currentIds = this.selectedServiceIds();
    const newIds = currentIds.filter((id) => id !== serviceId);
    this.selectedServiceIds.set(newIds);
    this.form.patchValue({ serviceIds: newIds });
  }

  removeProduct(productId: string) {
    const currentIds = this.selectedProductIds();
    const newIds = currentIds.filter((id) => id !== productId);
    this.selectedProductIds.set(newIds);
    this.form.patchValue({ productIds: newIds });
  }

  async createOrUpdate() {
    if (!this.form.valid) return;

    const fv = this.form.getRawValue();

    const services = this.selectedServices();
    const products = this.selectedProducts();

    const entity: Order = {
      id: this.order?.id ?? crypto.randomUUID(), // pega do @Input
      customerId: fv.customerId,
      motorcycleId: fv.motorcycleId,
      services: services.length > 0 ? services : undefined,
      products: products.length > 0 ? products : undefined,
      status: fv.status,
      totalPrice: this.totalPrice(),
      createdDate: this.isEdit()
        ? this.order?.createdDate || new Date().toISOString()
        : new Date().toISOString(),
    };

    try {
      if (this.isEdit()) {
        await this.orderService.updateOrder(entity);
      } else {
        await this.orderService.addOrder(entity);
      }
      this.closeModal();
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao salvar o pedido. Tente novamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}

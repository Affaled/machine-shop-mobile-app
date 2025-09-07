import { CommonModule } from '@angular/common';
import { Component, Input, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Order } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { Work } from 'src/app/models/work.model';
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
    IonHeader,
    IonButton,
    IonContent,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonList
  ]
})
export class OrderFormModal {
  @Input() id?: string;

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
    return this.allMotorcycles().filter(m => m.customerId === customerId);
  });


  private selectedServiceIds = signal<string[]>([]);
  private selectedProductIds = signal<string[]>([]);
  

  public readonly selectedServices = computed(() => {
    const serviceIds = this.selectedServiceIds();
    return this.works$().filter(w => serviceIds.includes(w.id));
  });

  public readonly selectedProducts = computed(() => {
    const productIds = this.selectedProductIds();
    return this.products$().filter(p => productIds.includes(p.id));
  });


  public readonly totalPrice = computed(() => {
    const servicesTotal = this.selectedServices().reduce((sum, service) => sum + service.price, 0);
    const productsTotal = this.selectedProducts().reduce((sum, product) => sum + product.price, 0);
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
    this.form = this.fb.group({
      customerId: ['', Validators.required],
      motorcycleId: ['', Validators.required],
      status: ['pending', Validators.required],
      serviceIds: [[]],
      productIds: [[]]
    });

    effect(() => {
    this.allMotorcycles.set(this.motorcycleService.motorcycles$());
  });
  }
  


  async ngOnInit() {
    this.allMotorcycles.set(this.motorcycles$());

    this.id = this.route.snapshot.paramMap.get('id') ?? this.id;
    if (this.id) {
      const record = await this.orderService.getById(this.id);
      if (record) {
        this.isEdit.set(true);
        
        const serviceIds = record.services?.map(s => s.id) || [];
        const productIds = record.products?.map(p => p.id) || [];
        
        this.selectedServiceIds.set(serviceIds);
        this.selectedProductIds.set(productIds);

        this.form.patchValue({
          customerId: record.customerId,
          motorcycleId: record.motorcycleId,
          status: record.status,
          serviceIds: serviceIds,
          productIds: productIds
        });
      }
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  onCustomerChange(event: any) {

    const customerId = event.detail.value;
    if(customerId && customerId !== '') this.form.get('motorcycleId')?.enable();
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
    const newIds = currentIds.filter(id => id !== serviceId);
    this.selectedServiceIds.set(newIds);
    this.form.patchValue({ serviceIds: newIds });
  }

  removeProduct(productId: string) {
    const currentIds = this.selectedProductIds();
    const newIds = currentIds.filter(id => id !== productId);
    this.selectedProductIds.set(newIds);
    this.form.patchValue({ productIds: newIds });
  }

  async createOrUpdate() {
    if (!this.form.valid) return;

    const fv = this.form.getRawValue();
    
    const services = this.selectedServices();
    const products = this.selectedProducts();

    const entity: Order = {
      id: this.id ?? crypto.randomUUID(),
      customerId: fv.customerId,
      motorcycleId: fv.motorcycleId,
      services: services.length > 0 ? services : undefined,
      products: products.length > 0 ? products : undefined,
      status: fv.status,
      totalPrice: this.totalPrice(),
      createdDate: this.isEdit() ? 
        (await this.orderService.getById(this.id!))?.createdDate || new Date().toISOString() : 
        new Date().toISOString()
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
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
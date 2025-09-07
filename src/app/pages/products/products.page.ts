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

import { Product } from "src/app/models/product.model";
import { ProductService } from "src/app/services/product.service";
import { ProductFormModal } from "./product-form.modal";


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
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
export class ProductsPage implements OnInit {
  searchTerm = signal('');
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  public readonly products$ = this.productService.products$;

  filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const products = this.products$();

    if (!term) return products;

    return products.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  });

  async deleteProduct(product: Product) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o produto ${product.name}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: async () => {
            await this.productService.deleteProduct(product.id);
          }
        }
      ]
    });
    await alert.present();
  }

  async refresh(event: any) {
    event.target.complete();
  }

  async openModal(product?: Product) {
    const modal = await this.modalController.create({
      component: ProductFormModal,
      cssClass: 'sheet-modal',
      animated: true,
      backdropDismiss: true,
      initialBreakpoint: 1,
      breakpoints: [0, 0.4, 0.6, 0.8, 1],
      componentProps: { product } 
    });

    modal.onDidDismiss().then(() => {
    });

    return await modal.present();
  }

  ngOnInit() {}
}

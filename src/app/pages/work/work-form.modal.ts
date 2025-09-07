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
import { Work } from 'src/app/models/work.model';
import { WorkService } from 'src/app/services/work.service';

@Component({
  selector: 'app-work-form-modal',
  templateUrl: './work-form.modal.html',
  styleUrl: './work-form.modal.scss',
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
    IonSelect,
    IonSelectOption,
  ],
})
export class WorkFormModal {
  work?: Work;

  isEdit = signal(false);
  form: FormGroup;
  works = signal<Work[]>([]);

  public readonly works$ = this.workService.work$;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private workService: WorkService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
    });
  }

  async ngOnInit() {
    if (this.work) {
      this.isEdit.set(true);
      this.form.patchValue({
        name: this.work.name,
        description: this.work.description,
        price: this.work.price,
      });
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
  async createOrUpdate() {
    if (!this.form.valid) return;

    const fv = this.form.getRawValue();
    const record: Work = {
      id: this.work?.id || crypto.randomUUID(),
      name: fv.name,
      description: fv.description,
      price: fv.price,
    };
    if (this.isEdit()) await this.workService.updateWork(record);
    else await this.workService.addWork(record);

    this.closeModal();
  }
}

import {
  Component,
  EnvironmentInjector,
  inject,
  ViewChild,
} from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bicycle,
  bicycleOutline,
  person,
  personOutline,
  build,
  buildOutline,
  storefront,
  storefrontOutline,
  bag,
  bagOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  @ViewChild(IonTabs) tabs?: IonTabs;

  constructor() {
    addIcons({
      bicycle,
      bicycleOutline,
      person,
      personOutline,
      build,
      buildOutline,
      storefront,
      storefrontOutline,
      bag,
      bagOutline,
    });
  }
}

import {Injectable} from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  short_label?: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const MENUITEMS = [
  {
    label: 'Gestion des inscriptions',
    state: 'gestion-inscriptions',
    main: [
    {
        state: 'gestion-inscriptions',
        short_label: 'GI',
        name: 'Gestion des inscriptions',
        type: 'sub',
        icon: 'ti-package',
        children: [
          {
            state: 'banque',
            short_label: 'B',
            name: 'Banque',
            type: 'link',
            icon: 'ti-money',
          },
          {
            state: 'departement',
            short_label: 'D',
            name: 'Département',
            type: 'link',
            icon: 'ti-institution',
          },
          {
            state: 'droit-universitaire',
            short_label: 'DU',
            name: 'Droit universitaire',
            type: 'link',
            icon: 'ti-money',
          },
          {
            state: 'etudiant',
            short_label: 'ET',
            name: 'Etudiants',
            type: 'link',
            icon: 'ti-package',
          },
          {
            state: 'inscription',
            short_label: 'I',
            name: 'Inscriptions',
            type: 'link',
            icon: 'ti-package',
          },
          {
            state: 'paiement',
            short_label: 'P',
            name: 'Paiements',
            type: 'link',
            icon: 'ti-package',
          },
          {
            state: 'pays',
            short_label: 'P',
            name: 'Pays',
            type: 'link',
            icon: 'ti-package',
          },
          {
            state: 'region',
            short_label: 'R',
            name: 'Region',
            type: 'link',
            icon: 'ti-package',
          },
          {
            state: 'blank-inscription',
            short_label: 'A',
            name: 'Accueil',
            type: 'link',
            icon: 'ti-package',
          }
      ]
    }
  ]
}
];

@Injectable()
export class MenuItemsInscription {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  /*add(menu: Menu) {
    MENUITEMS.push(menu);
  }*/
}

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
    label: 'Gestion des domaines',
    main: [
      {
        state: 'gestion-domaines',
        short_label: 'GD',
        name: 'Gestion des domaines',
        type: 'sub',
        icon: 'ti-package',
        children: [
          {
            state: 'domaines',
            name: 'Domaines'
          },
          {
            state: 'sous-domaines',
            name: 'Sous-domaines'
          },
          {
            state: 'cycles',
            name: 'Cycles'
          },
          {
            state: 'cycles-domaines',
            name: 'Cycles-Domaines'
          },
          {
            state: 'niveaux',
            name: 'Niveaux'
          },
          { 
            state: 'filieres',
            name: 'Filières'
          },
          {
            state: 'specialites',
            name: 'Spécialités'
          },
          {
            state: 'classes',
            name: 'Classes'
          },
          {
            state: 'blank-domaine',
            name: 'Accueil'
          }
        ]
      }
    ]
  }
];

@Injectable()
export class MenuItemsDomaine {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  /*add(menu: Menu) {
    MENUITEMS.push(menu);
  }*/
}

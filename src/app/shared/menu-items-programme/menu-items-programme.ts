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
    label: 'Gestion des programmes',
    main: [
      {
        state: 'gestion-programmes',
        short_label: 'GP',
        name: 'Gestion des programmes',
        type: 'sub',
        icon: 'ti-package',
        children: [
          {
            state: '',
            name: 'Programme',
            type: 'sub',
            children: [
              {
                  state: '',
                  name: 'Nouveau programme'
              },
              {
                  state: '',
                  name: 'Reconduire un programme'
              }
            ]
          },
          {
            state: 'programmes',
            name: 'Programmes'
          },
          {
            state: 'ue',
            name: 'Ue'
          },
          {
            state: 'categorieues',
            name: 'Catégorie d\'UE'
          },
          {
            state: 'ec',
            name: 'Ec'
          },
          {
            state: 'EcUe',
            name: 'Ec-ue'
          },
          {
            state: 'evaluations',
            name: 'Evaluations'
          },
          {
            state: 'type-evaluation',
            name: 'Type Evaluation'
          },
          {
            state: 'enseignants',
            name: 'Enseignants'
          },
          {
            state: 'enseignants-ec',
            name: 'Enseignants Ec'
          },
          {
            state: 'semestres',
            name: 'Semestres'
          },
          {
            state: 'blank-program',
            name: 'Accueil'
          }
        ]
      }
    ]
  }
];

@Injectable()
export class MenuItemsProgramme {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  /*add(menu: Menu) {
    MENUITEMS.push(menu);
  }*/
}

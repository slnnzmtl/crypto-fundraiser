import { makeAutoObservable, action } from 'mobx';
import { IView, ViewType } from './interfaces';

const VIEW_TYPE_KEY = 'campaignViewType';

export class ViewStore implements IView {
  viewType: ViewType = localStorage.getItem(VIEW_TYPE_KEY) as ViewType || 'grid';
  showOnlyOwned: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setViewType = action((type: ViewType) => {
    this.viewType = type;
    localStorage.setItem(VIEW_TYPE_KEY, type);
  });

  setShowOnlyOwned = action((show: boolean) => {
    this.showOnlyOwned = show;
  });
}

export const viewStore = new ViewStore(); 
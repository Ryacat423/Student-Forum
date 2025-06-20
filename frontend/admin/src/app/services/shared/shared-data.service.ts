
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedDataService {
  private categoryCountSource = new BehaviorSubject<number>(0);
  currentCategoryCount = this.categoryCountSource.asObservable();

  updateCategoryCount(count: number) {
    this.categoryCountSource.next(count);
  }

  getCategoryCountValue(): number {
    return this.categoryCountSource.getValue();
  }
}

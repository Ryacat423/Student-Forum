import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../../../../Pipe/search/search-filter.pipe';

@Component({
  selector: 'app-user-view',
  imports: [FormsModule, SearchFilterPipe],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent implements OnChanges {
  
  @Input() reportedUsers: any;
  @Output() updateCount = new EventEmitter();
  @Output() selectUser = new EventEmitter();
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['reportedUsers']) {
      this.updateCount.emit(this.reportedUsers?.length);
    }
  }

  keyword: any;

  select(user:any, showNotice: boolean = false) {
    this.selectUser.emit({ ...user, showNotice });
  }
}

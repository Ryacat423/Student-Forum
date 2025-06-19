import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SearchFilterPipe } from '../../../../Pipe/search/search-filter.pipe';

@Component({
  selector: 'app-topics',
  imports: [SearchFilterPipe, FormsModule, RouterModule, CommonModule],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.css'
})
export class TopicsComponent implements OnChanges, OnInit {

  @Input() topics: any[] = [];
  @Input() categ_data: any;
  @Input() currentuser: any;
  @Output() switch = new EventEmitter<string>();

  constructor(private route: ActivatedRoute) {}
  
  categoryId: any;
  topicId: any;

  active: string = 'all';
  filteredTopics: any[] = [];
  
  keyword: any;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['topics']) {
      this.updateFilteredTopics();
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
      this.topicId = params.get('topicId');
    });
  }

  getInitials(fullName: string | undefined | null): string {
    if (!fullName) return '';
  
    const parts = fullName.trim().split(' ');
    const firstInitial = parts[0]?.charAt(0) ?? '';
    const secondInitial = parts[1]?.charAt(0) ?? '';
  
    return firstInitial + secondInitial;
  }

  toggleOwn(){
    this.active = 'own';
    this.updateFilteredTopics();
    this.switch.emit(this.active);
  }

  toggleAll(){
    this.active = 'all';
    this.updateFilteredTopics();
    this.switch.emit(this.active);
  }

  updateFilteredTopics() {
    if (this.active === 'own' && this.currentuser) {
      this.filteredTopics = this.topics.filter(topic => 
        topic.userID === this.currentuser || topic.userID === this.currentuser
      );
    } else {
      this.filteredTopics = [...this.topics];
    }
  }
}

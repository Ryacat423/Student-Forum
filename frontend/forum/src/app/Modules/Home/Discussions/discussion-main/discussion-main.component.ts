import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../../../components/breadcrumbs/breadcrumbs.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../../services/forum/data.service';
import { NewTopicComponent } from '../new-topic/new-topic.component';
import { TopicsComponent } from '../topics/topics.component';

@Component({
  selector: 'app-discussion-main',
  imports: [BreadcrumbsComponent, NewTopicComponent, TopicsComponent],
  templateUrl: './discussion-main.component.html',
  styleUrl: './discussion-main.component.css'
})
export class DiscussionMainComponent implements OnInit{
  constructor(
    private acroute: ActivatedRoute,
    private dservice: DataService,
    private r: Router
  ) {}

  isLoading: boolean = false;
  topics: any;
  category_data: any;

  name: any;
  id: any = '';
  status: any;

  show_add: boolean = false;
  activeFilter: string = 'all';
  msg: any;

  navs = [
    { label: 'Categories', link: this.id ? '/forum/home' : '/public/home' }
  ];
  
  current: string = 'Home';

  ngOnInit(): void {
    this.acroute.paramMap.subscribe(categ => {
      this.name = categ.get('id');
      this.getTopics(this.name)
      this.getCategoryData(this.name);
    });

    this.id = localStorage.getItem('u_token');
    this.status = localStorage.getItem('status');
  }

  getTopics(id: number){
    this.isLoading = true;
    this.dservice.getTopics(id, this.activeFilter).subscribe((res: any)=> {
      this.topics = res;
      this.isLoading = false;
    })
  }

  getCategoryData(id: number) {
    this.dservice.getCategoryById(id).subscribe((res:any)=>{
      this.category_data = res.category;
      this.current = this.category_data.name;
    })
  }

  refreshTopics(newTopics: any){
    this.topics = newTopics.body?.topics;
  }

  addTopic(){
    this.show_add = true;
  }

  onFilterChange(filter: string) {
    this.activeFilter = filter;
  }

  getOwnTopicCount(): number {
    return this.topics?.filter((t:any) => t.user_id === parseInt(this.id))?.length || 0;
  }

  showAdd(){
    if(this.status != 'muted'){
      this.show_add = !this.show_add;
    } else {
      this.msg = 'Muted. Cannot perform Action.'
    }
  }
}
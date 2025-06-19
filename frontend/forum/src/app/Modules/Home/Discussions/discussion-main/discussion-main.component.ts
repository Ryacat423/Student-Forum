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

  topics: any;
  categ_topics: any;

  name: any;
  id: any;
  status: any;

  show_add: boolean = false;
  activeFilter: string = 'all';
  msg: any;

  navs = [
    { label: 'Home', link: '/forum/home' },
    { label: 'Categories', link: '/forum/home' }
  ];
  current: string = 'Home';
  imgurl: string = 'http://localhost/studentforum/admin/media/';

  ngOnInit(): void {
    this.acroute.paramMap.subscribe(categ => {
      this.name = categ.get('id');
      this.getTopics(this.name)
    });

    this.id = localStorage.getItem('token');
    this.status = localStorage.getItem('status');
  }

  getTopics(id: number){
    this.dservice.getTopics(id).subscribe((res: any)=> {
      this.topics = res.data;
      this.categ_topics = res.categ_data[0];
      this.current = this.categ_topics.category_name;
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
    return this.topics?.filter((t:any) => t.userID === this.id || t.user_id === this.id)?.length || 0;
  }

  showAdd(){
    if(this.status != 'muted'){
      this.show_add = !this.show_add;
    } else {
      this.msg = 'Muted. Cannot perform Action.'
    }
  }
}

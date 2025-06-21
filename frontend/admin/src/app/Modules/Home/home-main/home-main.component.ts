import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/forum/data.service';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from '../../../Pipe/search/search-filter.pipe';

@Component({
  selector: 'app-home-main',
  imports: [RouterModule, FormsModule, CommonModule, SearchFilterPipe],
  templateUrl: './home-main.component.html',
  styleUrl: './home-main.component.css'
})
export class HomeMainComponent implements OnInit {
  constructor(
    private dservice: DataService
  ){}

  keyword: any;
  applicants: any;

  ngOnInit(): void {
    this.getApplicants();
  }

  getApplicants() {
    this.dservice.getApplicants().subscribe((res: any)=> {
      this.applicants = res;
      console.log(this.applicants);
    })
  }
}

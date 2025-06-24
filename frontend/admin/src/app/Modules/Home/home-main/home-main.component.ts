import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/forum/data.service';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from '../../../Pipe/search/search-filter.pipe';
import { AuthService } from '../../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { SharedDataService } from '../../../services/shared/shared-data.service';

@Component({
  selector: 'app-home-main',
  imports: [RouterModule, FormsModule, CommonModule, SearchFilterPipe],
  templateUrl: './home-main.component.html',
  styleUrl: './home-main.component.css'
})
export class HomeMainComponent implements OnInit {
  constructor(
    private dservice: DataService,
    private auth: AuthService,
    private sharedservice: SharedDataService
  ){}

  keyword: any = '';
  applicants: any[] = [];
  allApplicants: any[] = [];

  pagination: any = {};

  pending: number = 0;
  students: number = 0;
  discussions: number = 0;
  posts: number = 0;

  Math = Math;

  ngOnInit(): void {
    this.getApplicants();
    this.getDashBoardStats();
    this.loadAllApplicantsForSearch();
  }

  getApplicants(page = 1) {
    this.dservice.getApplicants(page).subscribe((res: any) => {
      this.applicants = res.paginated.data; 
      this.pagination = {
        total: res.paginated.total,
        perPage: res.paginated.per_page,
        currentPage: res.paginated.current_page,
        lastPage: res.paginated.last_page
      };

      this.sharedservice.updateApplicantCount(this.pagination.total);
      this.pending = this.sharedservice.getApplicantCountValue();
    });
  }

  loadAllApplicantsForSearch() {
    this.dservice.getApplicants().subscribe((res: any) => {
      this.allApplicants = res.applicants;
    });
  }

  approveApplicant(userId: number) {
    this.auth.approveApplicant(userId).subscribe((res: any) => {
      if(res.success == 1) {
        this.getApplicants(this.pagination.currentPage);
        this.loadAllApplicantsForSearch();
      }
    });
  }

  getDashBoardStats() {
    this.dservice.getDashboardStats().subscribe((res: any) => {
      this.pending = res.pending;
      this.students = res.students;
      this.discussions = res.discussions;
      this.posts = res.posts;
    });

    this.sharedservice.updateApplicantCount(this.pending);
    this.pending = this.sharedservice.getApplicantCountValue();
  }

  showSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: 'Welcome back!',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
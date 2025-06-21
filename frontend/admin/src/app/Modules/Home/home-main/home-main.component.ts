import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/forum/data.service';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from '../../../Pipe/search/search-filter.pipe';
import { AuthService } from '../../../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-main',
  imports: [RouterModule, FormsModule, CommonModule, SearchFilterPipe],
  templateUrl: './home-main.component.html',
  styleUrl: './home-main.component.css'
})
export class HomeMainComponent implements OnInit {
  constructor(
    private dservice: DataService,
    private auth: AuthService
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

  approveApplicant(userId: number) {
    this.auth.approveApplicant(userId).subscribe((res: any)=> {
      if(res.success == 1) {
        this.getApplicants();
      }
    })
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

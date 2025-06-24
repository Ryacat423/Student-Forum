import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messages',
  imports: [BreadcrumbsComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent{

  current: string = 'Messages';
}

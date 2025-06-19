import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { VisionComponent } from '../vision/vision.component';
import { MissionComponent } from '../mission/mission.component';
import { HistoryComponent } from '../history/history.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-main',
  imports: [BreadcrumbsComponent, VisionComponent, MissionComponent, HistoryComponent, CommonModule],
  templateUrl: './about-main.component.html',
  styleUrl: './about-main.component.css'
})
export class AboutMainComponent {
  navs = [
    { label: 'Home', link: '/forum/home' }
  ];
  current: string = 'About Us';

  activeTab: string = 'history';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}

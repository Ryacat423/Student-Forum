import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionMainComponent } from './discussion-main.component';

describe('DiscussionMainComponent', () => {
  let component: DiscussionMainComponent;
  let fixture: ComponentFixture<DiscussionMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscussionMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

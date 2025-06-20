import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersMainComponent } from './members-main.component';

describe('MembersMainComponent', () => {
  let component: MembersMainComponent;
  let fixture: ComponentFixture<MembersMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

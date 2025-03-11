import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamChaperoneDashboardComponent } from './team-chaperone-dashboard.component';

describe('TeamChaperoneDashboardComponent', () => {
  let component: TeamChaperoneDashboardComponent;
  let fixture: ComponentFixture<TeamChaperoneDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamChaperoneDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamChaperoneDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

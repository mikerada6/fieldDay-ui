import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCaptainDashboardComponent } from './team-captain-dashboard.component';

describe('TeamCaptainDashboardComponent', () => {
  let component: TeamCaptainDashboardComponent;
  let fixture: ComponentFixture<TeamCaptainDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamCaptainDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamCaptainDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

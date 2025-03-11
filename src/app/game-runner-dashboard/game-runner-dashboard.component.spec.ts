import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRunnerDashboardComponent } from './game-runner-dashboard.component';

describe('GameRunnerDashboardComponent', () => {
  let component: GameRunnerDashboardComponent;
  let fixture: ComponentFixture<GameRunnerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRunnerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameRunnerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

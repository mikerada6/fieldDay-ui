import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { GameRunnerDashboardComponent } from './game-runner-dashboard/game-runner-dashboard.component';
import { TeamCaptainDashboardComponent } from './team-captain-dashboard/team-captain-dashboard.component';
import { TeamChaperoneDashboardComponent } from './team-chaperone-dashboard/team-chaperone-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [  // <-- Add export here
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'game-runner-dashboard', 
    component: GameRunnerDashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['GAME_RUNNER'] }
  },
  { 
    path: 'team-captain-dashboard', 
    component: TeamCaptainDashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['TEAM_CAPTAIN'] }
  },
  { 
    path: 'team-chaperone-dashboard', 
    component: TeamChaperoneDashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['TEAM_CHAPERONE'] }
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

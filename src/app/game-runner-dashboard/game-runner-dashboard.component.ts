import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameRunnerDashboardService } from './game-runner-dashboard.service';
import { Game } from './models/game.model';
import { Team } from './models/team.model';

@Component({
  selector: 'app-game-runner-dashboard',
  templateUrl: './game-runner-dashboard.component.html',
  styleUrls: ['./game-runner-dashboard.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule]
})
export class GameRunnerDashboardComponent implements OnInit {
  game: Game | undefined;
  teams: Team[] = [];
  loading = false;
  errorMessage = '';
  showInstructionsModal = false;
  selectedTeam: Team | null = null;
  editScoreModalOpen = false;
  editScoreValue: number | null = null;
  editMinutes: number | null = null;
  editSeconds: number | null = null;
  editMilliseconds: number | null = null;

  constructor(private dashboardService: GameRunnerDashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.errorMessage = '';
    this.loading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        this.game = {
          id: response.data.game.id,
          name: response.data.game.name,
          type: response.data.game.type.toLowerCase() as 'points' | 'time',
          highScoreWins: response.data.game.highScoreWins,
          location: response.data.game.location,
          equipment: response.data.game.equipment,
          numberOfTeamMembers: response.data.game.numberOfTeamMembers,
          instructions: response.data.game.instructions,
          objective: response.data.game.objective
        };

        this.teams = response.data.teams.map(apiTeam => ({
          id: apiTeam.teamId,
          name: apiTeam.teamName,
          flagUrl: `/assets/flags/${apiTeam.flagSvgFilename}`,
          teamCaptain: apiTeam.captainName,
          teamChaperone: apiTeam.chaperoneName, // corrected property name
          score: apiTeam.score !== null ? apiTeam.score : undefined,
          editing: false
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Failed to load dashboard data.';
        this.loading = false;
      }
    });
  }

  toggleEditing(team: Team): void {
    team.editing = !team.editing;
  }

  updateScore(team: Team): void {
    this.dashboardService.updateTeamScore(team.id, team.score).subscribe({
      next: () => {
        team.editing = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = `Failed to update score for ${team.name}.`;
      }
    });
  }

  toggleInstructionsModal(): void {
    this.showInstructionsModal = !this.showInstructionsModal;
  }

  openEditScore(team: Team): void {
    this.selectedTeam = team;
    this.editScoreModalOpen = true;
    if (this.game?.type === 'points') {
      this.editScoreValue = team.score ?? 0;
    } else if (this.game?.type === 'time') {
      const totalMs = team.score ?? 0;
      this.editMinutes = Math.floor(totalMs / 60000);
      this.editSeconds = Math.floor((totalMs % 60000) / 1000);
      this.editMilliseconds = totalMs % 1000;
    }
  }

  closeEditScore(): void {
    this.selectedTeam = null;
    this.editScoreModalOpen = false;
    this.editScoreValue = null;
    this.editMinutes = null;
    this.editSeconds = null;
    this.editMilliseconds = null;
  }

  submitScoreUpdate(): void {
    if (!this.selectedTeam || !this.game) {
      this.errorMessage = 'Missing team or game data.';
      return;
    }

    if (this.game.id == null) {
      this.errorMessage = 'Game ID is missing. Cannot update score.';
      return;
    }

    let newScore: number;
    if (this.game.type === 'points') {
      newScore = this.editScoreValue ?? 0;
    } else if (this.game.type === 'time') {
      const minutes = this.editMinutes ?? 0;
      const seconds = this.editSeconds ?? 0;
      const milliseconds = this.editMilliseconds ?? 0;
      newScore = minutes * 60000 + seconds * 1000 + milliseconds;
    } else {
      newScore = 0;
    }

    const payload = {
      gameId: this.game.id,
      teamId: this.selectedTeam.id,
      scoreValue: newScore
    };

    this.dashboardService.submitScoreUpdate(this.game.id, payload).subscribe({
      next: () => {
        this.selectedTeam!.score = newScore;
        this.closeEditScore();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = `Failed to update score for ${this.selectedTeam?.name}.`;
      }
    });
  }

  formatTime(score: number | undefined): string {
    if (score == null) return '00:00.000';
    const minutes = Math.floor(score / 60000);
    const seconds = Math.floor((score % 60000) / 1000);
    const milliseconds = score % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }
}

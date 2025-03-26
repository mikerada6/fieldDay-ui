import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamCaptainDashboardService } from './team-captain-dashboard.service';
import { TeamCaptainApiResponseModel } from '../models/team-captain-api-response.model';

@Component({
  selector: 'app-team-captain-dashboard',
  templateUrl: './team-captain-dashboard.component.html',
  styleUrls: ['./team-captain-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TeamCaptainDashboardComponent implements OnInit {
  games: TeamCaptainApiResponseModel['data']['games'] = [];
  loading = false;
  errorMessage = '';
  activeTab: 'my-games' | 'other-teams' = 'my-games';
  selectedGameIndex: number = 0;

  // Personalized properties
  currentCaptainName: string = '';
  currentTeamName: string = '';
  currentTeamFlag: string = '';

  // Track which objectives are visible
  objectiveVisible: boolean[] = [];

  // Track how many games have a valid score
  completedGamesCount: number = 0;

  showGameDetailsModal: boolean = false;
  selectedGameForDetails: any = null;


  constructor(private dashboardService: TeamCaptainDashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = '';
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        this.games = response.data.games;
        if (this.games.length > 0) {
          this.selectedGameIndex = 0;
          // Extract current team info from the first game
          const myTeam = this.games[0].teams.find(team => team.teamId === this.games[0].myTeamId);
          if (myTeam) {
            this.currentCaptainName = myTeam.captainName;
            this.currentTeamName = myTeam.teamName;
            this.currentTeamFlag = myTeam.flagSvgFilename;
          }
          this.completedGamesCount = this.games.filter(g => this.hasValidScore(g)).length;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Failed to load dashboard data.';
        this.loading = false;
      }
    });
  }


  setActiveTab(tab: 'my-games' | 'other-teams'): void {
    this.activeTab = tab;
  }

  toggleObjective(index: number): void {
    this.objectiveVisible[index] = !this.objectiveVisible[index];
  }

  /**
   * Determine if the user has a valid score for a given game.
   */
  hasValidScore(game: any): boolean {
    const myTeam = game.teams.find((team: any) => team.teamId === game.myTeamId);
    return myTeam?.score !== null && myTeam?.score !== undefined;
  }

  getMyTeamScore(game: any): number | string {
    const myTeam = game.teams.find((team: any) => team.teamId === game.myTeamId);
    if (!myTeam || myTeam.score == null) {
      return game.game.type.toLowerCase() === 'time' ? '--:--.---' : 'N/A';
    }
    return game.game.type.toLowerCase() === 'time'
      ? this.formatTime(myTeam.score)
      : myTeam.score;
  }

  formatTime(score: number): string {
    const minutes = Math.floor(score / 60000);
    const seconds = Math.floor((score % 60000) / 1000);
    const milliseconds = score % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }

  /**
   * Returns sorted teams (including your own) for the leaderboard
   */
  getLeaderboardTeams(game: any): any[] {
    interface Team {
      teamId: number;
      teamName: string;
      score: number | null;
      flagSvgFilename: string;
      captainName: string;
      chaperoneName: string;
    }
    const teams: Team[] = game.teams;
    return teams.sort((a: Team, b: Team) => {
      const scoreA = a.score;
      const scoreB = b.score;
      if (scoreA === null && scoreB === null) {
        return a.teamName.localeCompare(b.teamName);
      }
      if (scoreA === null) return 1;
      if (scoreB === null) return -1;
      return game.game.highScoreWins ? scoreB - scoreA : scoreA - scoreB;
    });
  }

  toggleGameDetails(game: any): void {
    this.selectedGameForDetails = game;
    this.showGameDetailsModal = true;
  }

  closeGameDetailsModal(): void {
    this.showGameDetailsModal = false;
    this.selectedGameForDetails = null;
  }
}

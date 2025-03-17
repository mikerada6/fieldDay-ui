export interface Game {
    id: number;
    name: string;
    type: 'points' | 'time';
    highScoreWins: boolean;
    location: string;
    equipment: string;
    numberOfTeamMembers: number;
    instructions: string;
    objective: string;
  }
  
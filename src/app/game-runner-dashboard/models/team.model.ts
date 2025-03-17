export interface Team {
    id: number;
    name: string;
    flagUrl: string;
    teamCaptain: string;
    teamChaperone: string; 
    score?: number;
    editing?: boolean;
  }
  
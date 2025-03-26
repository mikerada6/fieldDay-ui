export interface TeamCaptainApiResponseModel {
  status: number;
  message: string;
  data: {
    games: Array<{
      game: {
        id: number;
        name: string;
        type: string;
        highScoreWins: boolean;
        gameRunnerId: number;
        location: string;
        equipment: string;
        numberOfTeamMembers: number;
        objective: string;
        instructions: string;
      };
      teams: Array<{
        teamId: number;
        teamName: string;
        score: number | null;
        flagSvgFilename: string;
        captainName: string;
        chaperoneName: string;
      }>;
      myTeamId: number;
    }>;
  };
  timestamp: string;
}

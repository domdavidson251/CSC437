interface Athlete {
    age: number;
    displayName: string
    jersey: string;
    position: {
      displayName: string;
    };
  }
  
  interface Coach {
    id: string;
    firstName: string;
    lastName: string;
    experience: number;
  }
  
  interface Team {
    abbreviation: string;
    location: string;
    name: string;
    displayName: string;
    color: string;
  }

  interface Position {
    position: string;
    items: Athlete[];
  }
  export interface Season {
    year: number;
    type: number;
    name: string;
    displayName: string;

  }
  export interface RosterData {
    athletes: Position[];
    coach: Coach[];
    team: Team;
    season: Season;
  }

  export interface NBARosterData {
    athletes: Athlete[];
    coach: Coach[];
    team: Team;
    season: Season;
  }
export interface Team {
    id: string;
    name: string;
    abbreviation: string;
    displayName: string;
    location: string;
    color: string;
    alternateColor: string;
    logos: { href: string; }[];
    links: { href: string; text: string; }[];
  }
  
  export interface League {
    id: string;
    name: string;
    abbreviation: string;
    teams: { team: Team; }[];
  }
  
  export interface Sport {
    id: string;
    name: string;
    leagues: League[];
  }
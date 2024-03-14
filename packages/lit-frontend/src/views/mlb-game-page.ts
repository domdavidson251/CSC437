import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as App from "../app";

interface Game {
  id: string;
  date: string;
  name: string;
  location: string;
  homeTeam: Team;
  awayTeam: Team;
  homeTeamRecord: string;
  awayTeamRecord: string;
  statistics: GameStatistics;
  leaders: Leader[];
  status: Status;
}

interface Status {
  clock: string;
  displayClock: string;
  period: number;
  type: {
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  }
}

interface Team {
  id: string;
  name: string;
  abbreviation: string;
  logo: string;
}

interface GameStatistics {
  homeTeam: TeamStatistics;
  awayTeam: TeamStatistics;
}

interface TeamStatistics {
  hits: number;
  runs: number;
  avg: string;
  errors: number;
}

interface Leader {
  name: string;
  leaders: LeaderDetail[];
}

interface LeaderDetail {
  displayValue: string;
  athlete: Athlete;
}

interface Athlete {
  fullName: string;
  headshot: string;
}

type GameLocation = Location & {
  params: { gameid: string };
};

@customElement('mlb-game-page')
export class MLBGamePage extends App.View {
  @property({ type: Object }) gameData: Game | null = null;;

  @property({ attribute: false })
  location?: GameLocation;

  @property({ reflect: true })
  get gameid() {
    return this.location?.params.gameid;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchGameData();
  }

  async fetchGameData() {
    const gameid = this.gameid;
    try {
      const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard/${gameid}`);
      const data = await response.json();
      console.log(data);
      this.gameData = this.parseGameData(data);
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  }

  parseGameData(data: any): Game {
    // Extract relevant data from the JSON response
    const game: Game = {
      id: data.id,
      date: data.date,
      name: data.name,
      location: data.competitions[0].venue.fullName,
      homeTeam: this.parseTeam(data.competitions[0].competitors.find((team: any) => team.homeAway === 'home')),
      awayTeam: this.parseTeam(data.competitions[0].competitors.find((team: any) => team.homeAway === 'away')),
      homeTeamRecord: this.getTeamRecord(data.competitions[0].competitors.find((team: any) => team.homeAway === 'home')),
      awayTeamRecord: this.getTeamRecord(data.competitions[0].competitors.find((team: any) => team.homeAway === 'away')),
      statistics: {
        homeTeam: this.parseTeamStatistics(data.competitions[0].competitors.find((team: any) => team.homeAway === 'home')),
        awayTeam: this.parseTeamStatistics(data.competitions[0].competitors.find((team: any) => team.homeAway === 'away'))
      },
      leaders: data.competitions[0].leaders.map((leader: any) => ({
        name: leader.name,
        leaders: leader.leaders.map((leaderDetail: any) => ({
          displayValue: leaderDetail.displayValue,
          athlete: {
            fullName: leaderDetail.athlete.fullName,
            headshot: leaderDetail.athlete.headshot
          }
        }))
      })),
      status: data.status
    };
    return game;
  }

  parseTeam(teamData: any): Team {
    return {
      id: teamData.team.id,
      name: teamData.team.displayName,
      abbreviation: teamData.team.abbreviation,
      logo: teamData.team.logo
    };
  }

  parseTeamStatistics(teamData: any): TeamStatistics {
    return {
      hits: teamData.statistics.find((stat: any) => stat.name === 'hits').displayValue,
      runs: teamData.statistics.find((stat: any) => stat.name === 'runs').displayValue,
      avg: teamData.statistics.find((stat: any) => stat.name === 'avg').displayValue,
      errors: teamData.statistics.find((stat: any) => stat.name === 'errors').displayValue
    };
  }

  getTeamRecord(teamData: any): string {
    const records = teamData.records.find((record: any) => record.type === 'total');
    if (records) {
      return records.summary;
    }
    return '';
  }

  static styles = css`
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }

  .team-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #007bff;
    justify-content: center;
  }

  .team-container img {
    max-width: 80px; /* Adjust the max-width to your desired size */
    height: auto;
    margin-bottom: 8px;
  }

  .leaders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 20px;
  }

  .leader-item {
    border: 1px solid #007bff;
    border-radius: 8px;
    padding: 16px;
    box-sizing: border-box;
  }

  .leader-item img {
    max-width: 100%;
    height: auto;
    margin-bottom: 8px;
  }

`;

render() {
  if (!this.gameData) {
    return html`<div>Loading...</div>`;
  }
  const game = this.gameData;
  return html`
    <h1>${game.name}</h1>
    <p>Date: ${game.date}</p>
    <p>Location: ${game.location}</p>
    <div class="container">
      <div class="team-container">
        <h2>Home Team: ${game.homeTeam.name} (${game.homeTeamRecord}) </h2>
        <img src="${game.homeTeam.logo}" Logo">
        <p>Hits: ${game.statistics.homeTeam.hits}, AVG: ${game.statistics.homeTeam.avg}, Errors: ${game.statistics.homeTeam.errors}</p>
      </div>
      <div class="team-container">
        <h2>Away Team: ${game.awayTeam.name} (${game.awayTeamRecord}) </h2>
        <img src="${game.awayTeam.logo}" Logo">
        <p>Hits: ${game.statistics.awayTeam.hits}, AVG: ${game.statistics.awayTeam.avg}, Errors: ${game.statistics.awayTeam.errors}</p>
      </div>
    </div>
    <h3>Score: ${game.homeTeam.abbreviation} ${game.statistics.homeTeam.runs} - ${game.awayTeam.abbreviation} ${game.statistics.awayTeam.runs} ${game.status.type.detail}</h3>
    <h2>Leaders</h2>
    <div class="leaders-grid">
      ${game.leaders.flatMap(leader => leader.leaders.map(leaderDetail => html`
        <div class="leader-item">
          <img src="${leaderDetail.athlete.headshot}" alt="${leaderDetail.athlete.fullName}">
          ${leaderDetail.athlete.fullName}: ${leaderDetail.displayValue}
        </div>
      `))}
    </div>
  `;
}
}
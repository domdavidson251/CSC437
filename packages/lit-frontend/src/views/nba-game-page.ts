import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as App from "../app";

interface Team {
    displayName: string;
    logo: string;
}

interface Statistics {
    name: string;
    abbreviation: string;
    displayValue: string;
}

interface Athlete {
    displayName: string;
    headshot: string;
    position: {
        abbreviation: string;
    }
}

interface SpecificLeader {
    displayValue: string
    athlete: Athlete
}

interface Leader {
    displayName: string;
    leaders: SpecificLeader[];
}

interface Record {
    name: string;
    summary: string;
}

interface Competitor {
    homeAway: string;
    team: Team;
    score: string;
    statistics: Statistics[];
    leaders: Leader[];
    records: Record[]
}

interface Venue {
    fullName: string;
}

interface Headline {
    description: string;
    shortLinkText: string;
}

interface Game {
    competitors: Competitor[]
    venue: Venue;
    headlines: Headline[];
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

interface NBAGameData {
    date: string;
    name: string;
    competitions: Game[];
    status: Status;
    
}

type GameLocation = Location & {
    params: { gameid: string };
  };

@customElement('nba-game-page')
export class NBAGamePage extends App.View {
  @property({ type: Object }) gameData: NBAGameData | null = null;

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
      const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard/${gameid}`);
      const data = await response.json();
      console.log(data);
      this.gameData = data
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  }

  static styles = css`
  .competitors {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .competitor {
    width: 45%;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #007bff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .competitor img {
    max-width: 100px;
    margin-bottom: 10px;
  }

  .leaders {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr)); /* Adjusted to span two columns */
    grid-gap: 10px;
  }

  .leader-item {
    border: 1px solid #007bff;
    border-radius: 5px;
    padding: 10px;
    text-align: center;
  }

  .leader-item img {
    max-width: 80px; /* Increased the maximum width of leader images */
    border-radius: 50%;
    margin-bottom: 10px; /* Increased margin bottom for spacing */
  }

  h2 {
    text-align: center;
  }
`;

render() {
    if (!this.gameData) {
      return html`<div>Loading...</div>`;
    }
    const game = this.gameData
    return html`
      <h1>${game.name}</h1>
      <div>
        ${this.gameData.competitions.map((competition) => html`
          <p>${competition.venue.fullName} - ${game.date}</p>
          <p>${competition.headlines[0]?.shortLinkText}</p>
          <p>${competition.headlines[0]?.description}</p>
          <h2>${game.status.type.detail}</h2>
          <div class="competitors">
            ${competition.competitors.map((competitor) => html`
              <div class="competitor">
                <h3>${competitor.team.displayName} (${competitor.homeAway}) (${competitor.records[0].summary})</h3>
                <img src="${competitor.team.logo}" alt="${competitor.team.displayName} Logo">
                <p>Score: ${competitor.score}</p>
                <h4>Leaders</h4>
                <div class="leaders">
                  ${competitor.leaders.map((leader) => html`
                    <div class="leader-item">
                      <h5>${leader.displayName}</h5>
                      <img src="${leader.leaders[0].athlete.headshot}" alt="${leader.leaders[0].athlete.displayName} Headshot">
                      ${leader.leaders.map((specificLeader) => html`
                        <div class="athlete-item">
                          <span>${specificLeader.athlete.displayName}</span>
                          <span>${specificLeader.displayValue}</span>
                        </div>
                      `)}
                    </div>
                  `)}
                </div>
              </div>
            `)}
          </div>
        `)}
      </div>
    `;
  }
}
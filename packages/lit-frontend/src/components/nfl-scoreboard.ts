import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from "@vaadin/router";

interface Game {
  id: string;
  date: string;
  name: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  status: string;
}

@customElement('nfl-scoreboard')
export class NFLScoreboard extends LitElement {
  static styles = css`
    .game-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      grid-gap: 20px;
    }
    .game-item {
      border: 1px solid #007bff;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
    }
  `;

  static apiUrl = 'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

  games: Game[] = [];

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchScoreboard();
  }

  async fetchScoreboard() {
    try {
        console.log("try to fetch nba scoreboard");
      const response = await fetch(NFLScoreboard.apiUrl);
      const data = await response.json();
      if (data && data.events) {
        this.games = data.events.map((event: any) => ({
          id: event.id,
          date: event.date,
          name: event.shortName,
          homeTeam: event.competitions[0].competitors[0].team.displayName,
          awayTeam: event.competitions[0].competitors[1].team.displayName,
          homeScore: event.competitions[0].competitors[0].score,
          awayScore: event.competitions[0].competitors[1].score,
          status: event.competitions[0].status.type.detail
        }));
      } else {
        console.error('Failed to fetch scoreboard data:', data);
      }
    } catch (error) {
      console.error('Error fetching scoreboard data:', error);
    }
    this.requestUpdate();
  }

  renderGames() {
    return html`
    <div class="game-grid">
      ${this.games.map((game) => html`
        <div class="game-item" @click=${() => this.navigateToGamePage(game.id)}>
          <h3>${game.name} </h3>
          <p>${game.awayTeam} ${game.awayScore} - ${game.homeTeam} ${game.homeScore} ${game.status}</p>
        </div>
      `)}
    </div>
  `;
  }

  navigateToGamePage(gameId: string) {
    Router.go(`/app/nfl/games/${gameId}`);
  }

  render() {
    return html`
      <div>
        <h2>NFL Scoreboard</h2>
        ${this.renderGames()}
      </div>
    `;
  }
}
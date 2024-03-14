import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Router } from "@vaadin/router";


interface Team {
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

interface League {
  id: string;
  name: string;
  abbreviation: string;
  teams: { team: Team; }[];
}

interface Sport {
  id: string;
  name: string;
  leagues: League[];
}

@customElement('football-teams')
export class FootballTeams extends LitElement {
  @property({ type: Array }) sports: Sport[] = [];

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchData();
  }

  async fetchData() {
    try {
      const response = await fetch('http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams');
      const data = await response.json();
      this.sports = data.sports;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('sports')) {
      console.log(this.sports);
    }
  }

  static styles = css`
    .team-card {
      border: 1px solid #007bff;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      cursor: pointer;
    }
    .team-logo {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 50%;
      margin-right: 16px;
    }
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      grid-gap: 20px;
    }
  `;

  renderTeamCard(team: Team) {
    return html`
      <div class="team-card" style="border-color: ${team.color};"
            @click=${() => this.navigateToTeamPage(team.id)}>
        <img class="team-logo" src="${team.logos[0]?.href}" alt="${team.displayName} Logo">
        <div>
          <h2>${team.displayName}</h2>
          <p>Location: ${team.location}</p>
          <p>Abbreviation: ${team.abbreviation}</p>
          <a href="${team.links[0]?.href}" target="_blank">Team Page</a>
        </div>
      </div>
    `;
  }

  navigateToTeamPage(teamId: string) {
    Router.go(`/app/nfl/teams/${teamId}`);
  }

  render() {
    return html`
      <h2>NFL Teams</h2>
      <div class="team-grid">
        ${this.sports.map((sport: Sport) =>
          sport.leagues.map((league: League) =>
            league.teams.map((teamData: { team: Team }) =>
              this.renderTeamCard(teamData.team)
            )
          )
        )}
      </div>
    `;
  }
}
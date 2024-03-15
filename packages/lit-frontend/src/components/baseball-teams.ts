import { LitElement, html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Router } from "@vaadin/router";
import teamsCSS from "/src/styles/teams.css?inline";
import { Team, League, Sport } from "../../../ts-models/src/teams";

@customElement('baseball-teams')
export class BaseballTeams extends LitElement {
  @property({ type: Array }) sports: Sport[] = [];

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchData();
  }

  async fetchData() {
    try {
      const response = await fetch('http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams');
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

  static styles = unsafeCSS(teamsCSS);

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
    Router.go(`/app/mlb/teams/${teamId}`);
  }

  render() {
    return html`
      <h2>MLB Teams</h2>
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
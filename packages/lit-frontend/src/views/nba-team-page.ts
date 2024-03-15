import { html, unsafeCSS, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as App from "../app";
import "../components/nba-roster";
import { TeamPage } from "../../../ts-models/src/team-page";
import teamPageCSS from "/src/styles/team-page.css?inline";

type TeamLocation = Location & {
    params: { teamid: string };
  };
  
@customElement('nba-team-page')
export class NBATeamPage extends App.View {
  @property({ type: Object }) teamData: TeamPage | null = null;

  @property({ attribute: false })
  location?: TeamLocation;

  @property({ reflect: true })
  get teamid() {
    return this.location?.params.teamid;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchTeamData();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('teamid')) {
      console.log(this.teamid);
    }
  }

  async fetchTeamData() {
    const teamid = this.teamid;
    try {
      const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamid}`);
      const data = await response.json();
      this.teamData = data.team;
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  }

  static styles = unsafeCSS(teamPageCSS);

render() {
  if (!this.teamData) {
    return html`<div>Loading...</div>`;
  }
  const team = this.teamData;
  return html`
    <div class="team-info">
      <img class="team-logo" src="${team.logos[0].href}" alt="${this.teamData.displayName} Logo">
      <div class="record">
        <h1>${team.displayName}</h1>
        <p>Location: ${team.location}</p>
        <ul>
          ${team.record.items.map(item => html`
            <li>${item.description}: ${item.summary}</li>
          `)}
        </ul>
      </div>
      <div class="links">
        <h2>Links:</h2>
        <ul>
          ${team.links.map(link => html`
            <li><a href="${link.href}" target="_blank">${link.text}</a></li>
          `)}
        </ul>
      </div>
    </div>
    <nba-roster .teamid="${this.teamid}"></nba-roster>
  `;
}
}
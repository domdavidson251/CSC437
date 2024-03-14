import { html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as App from "../app";
import "../components/mlb-roster";

interface Team {
    id: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    color: string;
    alternateColor: string;
    logos: { href: string; }[];
    record: {
      items: {
        description: string;
        summary: string;
      }[];
    };
    links: { href: string; text: string; }[];
    franchise: {
      venue: {
        fullName: string;
        address: {
          city: string;
          state: string;
          zipCode: string;
        };
      };
    };
  }

type TeamLocation = Location & {
    params: { teamid: string };
  };
  
@customElement('mlb-team-page')
export class MLBTeamPage extends App.View {
  @property({ type: Object }) teamData: Team | null = null;

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
    console.log(teamid);
    try {
      const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/${teamid}`);
      const data = await response.json();
      this.teamData = data.team;
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  }

  static styles = css`
  .team-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }

  .team-logo {
    width: 100px;
    height: 100px;
    object-fit: contain;
    grid-column: span 2;
    justify-self: center;
  }

  .record,
  .links {
    border: 1px solid #007bff;
    border-radius: 8px;
    padding: 10px;
  }

  .record {
    grid-column: span 1;
  }

  .links {
    grid-column: span 1;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style: none;
    margin-bottom: 5px;
  }

  a {
    color: #007bff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

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
    <mlb-roster .teamid="${this.teamid}"></mlb-roster>
  `;
}
}
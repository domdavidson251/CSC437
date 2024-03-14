import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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

  interface Season {
    year: number;
    type: number;
    name: string;
    displayName: string;

  }
  interface RosterData {
    athletes: Athlete[];
    coach: Coach[];
    team: Team;
    season: Season;
  }

@customElement('nba-roster')
export class NBARoster extends LitElement {
    @property({ type: String }) teamid: string = '';

    @property({ type: Object }) rosterData: RosterData | null = null;

    async connectedCallback() {
        super.connectedCallback();
        await this.fetchRosterData();
    }

    async fetchRosterData() {
        try {
            const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${this.teamid}/roster`);
            const data = await response.json();
            console.log(data);
            this.rosterData = data;
        } catch (error) {
            console.error('Error fetching roster data:', error);
        }
    }

    static styles = css`
        /* Add your styles for mlb-roster here */
    `;

    render() {
        if (!this.rosterData) {
            return html`<div>Loading...</div>`;
        }
        return html`
        <div>
            <h2>${this.rosterData.team.displayName} Roster</h2>
            <p>Coach:</p>
            <ul>
                ${this.rosterData.coach.map(coach => html`
                    <li>${coach.firstName} ${coach.lastName} - ${coach.experience} years of experience</li>
                `)}
            </ul>
            <h3>Athletes:</h3>
            <ul>
                ${this.rosterData.athletes.map(athlete => html`
                    <li>
                        <strong>${athlete.displayName}</strong> - 
                        Age: ${athlete.age} - 
                        Jersey: ${athlete.jersey} - 
                        Position: ${athlete.position.displayName}
            
                    </li>
                `)}
            </ul>
        </div>
    `;
    }
}
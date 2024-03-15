import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import rosterCSS from "/src/styles/roster.css?inline";
import { RosterData } from "../../../ts-models/src/roster"

@customElement('nfl-roster')
export class NFLRoster extends LitElement {
    @property({ type: String }) teamid: string = '';

    @property({ type: Object }) rosterData: RosterData | null = null;

    async connectedCallback() {
        super.connectedCallback();
        await this.fetchRosterData();
    }

    async fetchRosterData() {
        try {
            const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${this.teamid}/roster`);
            const data = await response.json();
            console.log(data);
            this.rosterData = data;
        } catch (error) {
            console.error('Error fetching roster data:', error);
        }
    }

    static styles = unsafeCSS(rosterCSS);

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
                ${this.rosterData.athletes.map(position => html`
                    <li>
                        <h4>${position.position}</h4>
                        <ul>
                            ${position.items.map(athlete => html`
                                <li>
                                    <strong>${athlete.displayName}</strong> - 
                                    Age: ${athlete.age} - 
                                    Jersey: ${athlete.jersey} - 
                                    Position: ${athlete.position.displayName}
                                </li>
                            `)}
                        </ul>
                    </li>
                `)}
            </ul>
        </div>
    `;
    }
}
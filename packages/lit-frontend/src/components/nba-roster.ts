import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { NBARosterData } from "../../../ts-models/src/roster";
import rosterCSS from "/src/styles/roster.css?inline";

@customElement('nba-roster')
export class NBARoster extends LitElement {
    @property({ type: String }) teamid: string = '';

    @property({ type: Object }) rosterData: NBARosterData | null = null;

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
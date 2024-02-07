import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

interface Team {
    name: string;
    wins: number;
    losses: number;
    totalPoints: number;
}

const teams: Team[] = [
    { name: "Team 1", wins: 5, losses: 2, totalPoints: 300 },
    { name: "Team 2", wins: 3, losses: 4, totalPoints: 400 }
];

@customElement("standings-element")
export class ToggleSwitchElement extends LitElement {
  render() {
    return html`
        <h2>Standings</h2>
        <button @click="${() => this.sortByPoints()}">Sort by Points</button>
        <button @click="${() => this.sortByRecord()}">Sort by Record</button>
            <table>
                <thead>
                    <tr>
                        <th>Team</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Total Points</th>
                    </tr>
                </thead>
                <tbody>
                ${teams.map(team => html`
                    <tr>
                        <td>${team.name}</td>
                        <td>${team.wins}</td>
                        <td>${team.losses}</td>
                        <td>${team.totalPoints}</td>
                    </tr>
                `)}
                </tbody>
            </table>`;
  }

  sortByPoints() {
    teams.sort((a, b) => b.totalPoints - a.totalPoints);
    this.requestUpdate();
    }

  sortByRecord() {
    teams.sort((a, b) => {
        const winPercentageA = this.calculateWinPercentage(a);
        const winPercentageB = this.calculateWinPercentage(b);
        return winPercentageB - winPercentageA;
    });
    this.requestUpdate();
  }

  calculateWinPercentage(team: Team): number {
    return (team.wins / (team.wins + team.losses)) * 100;
  }

  static styles = css`

  h2 {
    color: var(--link-color); 
    font-family: 'Playfair Display', serif;
}
  table {
    border-collapse: collapse;
    width: 100%;
    font-family: var(--font-family);
}

th, td {
    border: 1px solid var(--border-color);
    padding: 8px;
    text-align: left;
}

th {
    background-color: var(--link-color);
    color: var(--header-text-color);
}

tbody tr:nth-child(even) {
    background-color: var(--main-background-color);
}

tbody tr:nth-child(odd) {
    background-color: var(--alt-background-color); 
}`;
}
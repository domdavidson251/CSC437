import { html, css } from "lit";
import { customElement} from "lit/decorators.js";
import * as App from "../app";
import { Router } from "@vaadin/router";
import "../components/league-card"

@customElement("league-page")
export class LeaguePageElement extends App.View {

    navigateToLeaguePage(league: string) {
        Router.go(`/app/${league.toLowerCase()}`)
    }

    render() {
        return html`
        <div class="card-container">
          <league-card @click="${() => this.navigateToLeaguePage('MLB')}" .data="${{ name: 'MLB', imageUrl: '../icons/mlb.png' }}"></league-card>
          <league-card @click="${() => this.navigateToLeaguePage('NBA')}" .data="${{ name: 'NBA', imageUrl: '../icons/nba.png' }}"></league-card>
          <league-card @click="${() => this.navigateToLeaguePage('NFL')}" .data="${{ name: 'NFL', imageUrl: '../icons/nfl.png' }}"></league-card>
        </div>
        `;
    }

    static styles = [css`
    .card-container {
      display: flex;
    }`];
}
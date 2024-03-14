import { html } from "lit";
import { customElement} from "lit/decorators.js";
import * as App from "../app";
import "../components/nba-scoreboard";
import "../components/nba-news";
import "../components/basketball-teams";

@customElement("nba-page")
export class NBAPageElement extends App.View {

    render() {
        return html`
        <nba-scoreboard></nba-scoreboard>
        <nba-news></nba-news>
        <basketball-teams></basketball-teams>
        `;
    }
}
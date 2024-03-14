import { html } from "lit";
import { customElement} from "lit/decorators.js";
import * as App from "../app";
import "../components/nfl-scoreboard";
import "../components/nfl-news";
import "../components/football-teams";

@customElement("nfl-page")
export class NFLPageElement extends App.View {

    render() {
        return html`
        <nfl-scoreboard></nfl-scoreboard>
        <nfl-news></nfl-news>
        <football-teams></football-teams>
        `;
    }
}
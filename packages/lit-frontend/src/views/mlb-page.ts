import { html } from "lit";
import { customElement} from "lit/decorators.js";
import * as App from "../app";
import "../components/baseball-teams";
import "../components/mlb-news";
import "../components/mlb-scoreboard";

@customElement("mlb-page")
export class MLBPageElement extends App.View {

    render() {
        return html`
        <mlb-scoreboard></mlb-scoreboard>
        <mlb-news></mlb-news>
        <baseball-teams></baseball-teams>
        `;
    }
}
import { html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
// MVU app
import * as App from "../app"
import routes from "../routes";
import update from "../update";
// components
import "../components/auth-required";
import "../components/vaadin-router";
import "../components/blazing-header";

import resetCSS from "/src/styles/reset.css?inline";
import pageCSS from "/src/styles/page.css?inline";
import tokensCSS from "/src/styles/tokens.css?inline";

@customElement("blazing-app")
export class BlazingAppElement extends App.Main {
    constructor() {
        super(update);
    }

    render() {
        return html`
            <auth-required>
                <blazing-header></blazing-header>
                <vaadin-router .routes=${routes}> </vaadin-router>
            </auth-required>
        `;
    }
    static styles = [unsafeCSS(resetCSS), unsafeCSS(pageCSS), unsafeCSS(tokensCSS)];
}
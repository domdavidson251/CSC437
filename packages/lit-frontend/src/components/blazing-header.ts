import { html, css, LitElement, unsafeCSS } from "lit";
import {
  customElement,
  property,
  state
} from "lit/decorators.js";
import { consume } from "@lit/context";
import { APIUser, APIRequest } from "../rest";
import { authContext } from "./auth-required";
import "./drop-down";
import { Profile } from "../../../ts-models/src/profile";
import resetCSS from "/src/styles/reset.css?inline";
import pageCSS from "/src/styles/page.css?inline";
import tokensCSS from "/src/styles/tokens.css?inline";
import { Router } from "@vaadin/router";

@customElement("blazing-header")
export class BlazingHeaderElement extends LitElement {
  @state()
  profile?: Profile;

  @consume({ context: authContext, subscribe: true })
  @property({ attribute: false })
  user = new APIUser();

  render() {
    const authenticated = this.user.authenticated;
    const welcome = authenticated
      ? html`
      <header>
        <drop-down>
          ${this.user.username}
          <ul slot="menu">
            <li><a href="#" @click="${this._signOut}">Sign out</a></li>
          </ul>
        </drop-down>
      </header>
        `
      : "Not logged in";

    return html`
      <header>
      <h1 @click="${this._navigateToApp}"> Sports App
        <svg class="icon">
          <use href="../../icons/sports.svg#icon-sports" />
        </svg>
      </h1>
        <p>${welcome}</p>
      </header>
    `;

  }

  _navigateToApp() {
    Router.go('/app');
  }

  static styles = [unsafeCSS(tokensCSS), unsafeCSS(pageCSS), unsafeCSS(resetCSS),
  css`
  h1{
    cursor: pointer;
  }`];


  updated(changedProperties: Map<string, unknown>) {
    console.log(
      "Profile Data has been updated",
      changedProperties
    );
    if (changedProperties.has("user")) {
      console.log("New user", this.user);
      const { username } = this.user;
      this._getData(`/api/profiles/${username}`);
    }
    return true;
  }

  _getData(path: string) {
    const request = new APIRequest();
    console.log(path);

    request
      .get(path)
      .then((response: Response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json: unknown) => {
        console.log("Profile:", json);
        this.profile = json as Profile;
      });
  }

  _signOut() {
    console.log("Signout");
    this.user.signOut();
    Router.go(`/app`);
  }
}
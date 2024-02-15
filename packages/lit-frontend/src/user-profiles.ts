import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Profile } from "../../express-backend/src/models/profile";
import { serverPath } from "./rest";

@customElement("user-profile")
export class UserProfileElement extends LitElement {
  @property()
  path: string = "";

  @state()
  profile?: Profile;

  render() {

    return html`
    <div>
      <h2>User Profile</h2>
      <ul>
        <li><strong>User ID:</strong> ${this.profile?.userid}</li>
        <li><strong>Name:</strong> ${this.profile?.name}</li>
        <li>
          <strong>Teams:</strong>
          <ul>
            ${this.profile?.teams.map(team => html`<li>${team}</li>`)}
          </ul>
        </li>
        <li>
          <strong>Leagues:</strong>
          <ul>
            ${this.profile?.leagues.map(league => html`<li>${league}</li>`)}
          </ul>
        </li>
      </ul>
    </div>
    `;
  }

  _fetchData(path: string) {
    fetch(serverPath(path))
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json: unknown) => {
          if (json) this.profile = json as Profile;
      });
  }

  connectedCallback() {
    if (this.path) {
      this._fetchData(this.path);
    }
    super.connectedCallback();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
    ) {
        if (name === "path" && oldValue !== newValue && oldValue) {
            this._fetchData(newValue);
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
}

@customElement("user-profile-edit")
export class UserProfileEditElement extends UserProfileElement {

  render() {
    return html`
    <form @submit=${this._handleSubmit}>
      <label for="name">Name:</label>
      <input type="text" id="name" name="name"><br><br>
      <label for="teams">Teams (comma-separated):</label>
      <input type="text" id="teams" name="teams"><br><br>
      <label for="leagues">Leagues (comma-separated):</label>
      <input type="text" id="leagues" name="leagues"><br><br>

      <button type="submit">Submit</button>
    </form>
    `;
  }

  _handleSubmit(ev: Event) {
    ev.preventDefault(); // prevent browser from submitting form data itself
    const target = ev.target as HTMLFormElement;
    const formdata = new FormData(target);
    let entries = Array.from(formdata.entries())
      .map(([k, v]) => (v === "" ? [k] : [k, v]))
      .map(([k, v]) =>
        k === "teams" || k === "leagues"
          ? [k, (v as string).split(",").map((s) => s.trim())]
          : [k, v]
      );
    const json = Object.fromEntries(entries);
    console.log(json);
    this._putData(json);
  }

  _putData(json: Profile) {
    console.log(serverPath(this.path));
    fetch(serverPath(this.path), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json)
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else return null;
      })
      .then((json: unknown) => {
        if (json) this.profile = json as Profile;
      })
      .catch((err) =>
        console.log("Failed to PUT form data", err)
      );
  }
}
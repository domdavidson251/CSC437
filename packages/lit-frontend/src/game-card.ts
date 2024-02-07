import { css, html, LitElement } from 'lit';
import { customElement } from "lit/decorators.js";

@customElement("game-card")
export class GameItem extends LitElement {
  static styles = css`
    .card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 10px;
    }

    a {
        color: var(--link-color);
        font-family: var(--font-family);
        text-decoration: none;
    }
  `;

  render() {
    return html`
      <div class="card">
        <a href="${this.getAttribute('link')}">
          <slot name="team1"></slot> @ <slot name="team2"></slot>
        </a>
      </div>
    `;
  }
}

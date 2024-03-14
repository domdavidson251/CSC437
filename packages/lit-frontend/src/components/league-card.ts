import { LitElement, html, css} from 'lit';
import { property, customElement } from 'lit/decorators.js';


interface CardData {
    name: string;
    imageUrl: string;
}

@customElement("league-card")
export class LeagueCardComponent extends LitElement {
    @property({ type: Object}) data: CardData = { name: '', imageUrl: ''}

    static styles = css`
    .card {
      width: 200px;
      padding: 16px;
      border: 2px solid #007bff;
      border-radius: 8px;
      text-align: center;
      margin: 10px;
    }
    img {
      max-width: 100%;
      max-height: 100px;
    }
  `;

  render() {
    return html`
        <div class="card">
            <h2>${this.data.name}</h2>
            <img src="${this.data.imageUrl}" alt="${this.data.name} "logo">
        </div>
    `;
  }

}
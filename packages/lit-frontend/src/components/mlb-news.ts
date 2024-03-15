import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NewsArticle } from "../../../ts-models/src/news-article";
import newsCSS from "/src/styles/news.css?inline";

@customElement('mlb-news')
export class MLBNews extends LitElement {
  static styles = unsafeCSS(newsCSS);

  static apiUrl = 'http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/news';

  newsData: NewsArticle[] = [];

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchNews();
  }

  async fetchNews() {
    try {
      const response = await fetch(MLBNews.apiUrl);
      const data = await response.json();
      if (data && data.articles) {
        this.newsData = data.articles;
      } else {
        console.error('Failed to fetch news data:', data);
      }
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
    this.requestUpdate();
  }

  renderNews() {
    return html`
    <div class="news-grid">
      ${this.newsData.map((article) => html`
        <div class="news-item">
          <h3>${article.headline}</h3>
          <p>${article.description}</p>
          <img src="${article.images[0].url}" alt="${article.images[0].caption}">
          <a href="${article.links.web.href}" target="_blank">Read more</a>
        </div>
      `)}
    </div>
  `;
  }

  render() {
    return html`
      <div>
        <h2>MLB News</h2>
          ${this.renderNews()}
      </div>
    `;
  }
}
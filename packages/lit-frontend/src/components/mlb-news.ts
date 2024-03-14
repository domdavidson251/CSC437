import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';


interface NewsArticle {
    headline: string;
    description: string;
    images: { url: string; caption: string }[];
    links: { web: { href: string } };
  }

@customElement('mlb-news')
export class MLBNews extends LitElement {
  static styles = css`
    .news-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      grid-gap: 20px;
    }
    .news-item {
      border: 1px solid #007bff;
      border-radius: 8px;
      padding: 16px;
      box-sizing: border-box; /* Ensure padding doesn't increase the width */
      display: flex;
      flex-direction: column;
    }
    .news-item img {
      max-width: 100%;
      height: auto;
      margin-bottom: 12px; /* Add some spacing between image and text */
    }
  `;

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
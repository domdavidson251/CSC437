export interface NewsArticle {
    headline: string;
    description: string;
    images: { url: string; caption: string }[];
    links: { web: { href: string } };
  }
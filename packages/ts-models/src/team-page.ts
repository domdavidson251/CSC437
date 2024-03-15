export interface TeamPage {
    id: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    color: string;
    alternateColor: string;
    logos: { href: string; }[];
    record: {
      items: {
        description: string;
        summary: string;
      }[];
    };
    links: { href: string; text: string; }[];
    franchise: {
      venue: {
        fullName: string;
        address: {
          city: string;
          state: string;
          zipCode: string;
        };
      };
    };
  }
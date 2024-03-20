import { BrowserContext } from "playwright";

export abstract class Store {
  readonly name: string;
  private url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  getUrl(): string {
    return this.url;
  }

  setUrl(url: string): void {
    this.url = url;
  }

  abstract modifyUrl(url: string): string;
  abstract scrapeGames(context: BrowserContext, query: string): Promise<any>;
}

import { Page } from "playwright";
import { StoreInfo } from "../types";

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
  abstract scrapeGames(page: Page, query: string): Promise<StoreInfo | []>;
}

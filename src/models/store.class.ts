import { Page } from "playwright";
import { PriceFromUrlScraped, StoreInfo } from "../types";

export abstract class Store {
  readonly name: string;
  private url: string;
  private storeCounter: number = 0;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  getStoreCounter(): number {
    return this.storeCounter;
  }

  addOneToCounter(): void {
    this.storeCounter++;
  }

  resetCounter(): void {
    this.storeCounter = 0;
  }

  getUrl(): string {
    return this.url;
  }

  setUrl(url: string): void {
    this.url = url;
  }

  abstract modifyUrl(url: string): string;
  abstract scrapeGames(page: Page, query: string): Promise<StoreInfo>;
  abstract scrapePriceGameFromUrl(
    page: Page,
    url: string
  ): Promise<PriceFromUrlScraped>;
}

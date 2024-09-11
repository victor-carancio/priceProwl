import { xboxStoreConfig } from "./../utils.model";
import { parseUrl, replaceSteam, replaceXbox } from "../../utils/game.utils";
import { Store } from "../store.class";
import { StoreInfo } from "../../types";

import { XboxSearch, XboxSearchImage } from "../types";

export class XboxStore extends Store {
  constructor() {
    super("Xbox");
  }

  private searchUrl(term: string) {
    const queryParsed = parseUrl(term, "-");
    return `SEARCH_GAMES_SEARCHQUERY=${queryParsed}_PLAYWITH=PC`;
  }

  private singleSearchUrl(id: string) {
    return `https://emerald.xboxservices.com/xboxcomfd/productDetails/${id}?locale=en-CL&enableFullDetail=true`;
  }

  private xboxSearchImage(images: XboxSearchImage) {
    return (
      images.boxArt?.url ?? images.poster?.url ?? images.superHeroArt?.url ?? ""
    );
  }

  private offerEndDate(discount: number, endDate: string) {
    return discount === 0 ? null : endDate;
  }

  async scrapeGamesFromSearch(
    query: string,
    currency: string,
  ): Promise<StoreInfo> {
    const data = {
      Query: query.trim(),
      Filters: xboxStoreConfig.Filters,
      ReturnFilters: false,
      ChannelKeyToBeUsedInResponse: this.searchUrl(query),
    };

    const res = await fetch(`${xboxStoreConfig.url}${currency}`, {
      method: "POST",
      headers: xboxStoreConfig.headers,
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (responseData.productSummaries.length <= 0) {
      return { store: this.name, type: this.type, storeInfo: [] };
    }

    const currData: XboxSearch[] = [...responseData.productSummaries];

    const formatedData = currData
      .filter((element) => element.specificPrices.purchaseable.length > 0)
      .map((element) => {
        const { productId, specificPrices, title, images } = element;
        const { listPrice, msrp, discountPercentage, currencyCode } =
          specificPrices.purchaseable[0];
        const urlTitle = parseUrl(title.toLowerCase(), "-");

        return {
          storeId: productId,
          gameName: title,
          gamepass: "optimalSatisfyingPassId" in element ? true : false,
          url: `https://www.xbox.com/es-CL/games/store/${urlTitle}/${productId}`,
          imgStore: this.xboxSearchImage(images),
          discount_percent: discountPercentage.toFixed(),
          currency: currencyCode,
          initial_price: msrp.toFixed(),
          final_price: listPrice.toFixed(),
        };
      });

    const games = formatedData
      .map((el) => {
        return { ...el, gameName: replaceSteam(replaceXbox(el.gameName)) };
      })
      .filter((game) =>
        game.gameName.toLowerCase().includes(query.trim().toLowerCase()),
      )
      .filter((game) => game.initial_price && game.final_price)
      .filter((game) => !game.gameName.toLowerCase().includes("xbox"));

    return { store: this.name, type: this.type, storeInfo: games };
  }

  async scrapeGameFromUrl(storeId: string) {
    const res = await fetch(this.singleSearchUrl(storeId), {
      headers: xboxStoreConfig.singleGameHeaders,
    });

    const responseData = await res.json();

    if (responseData.productSummaries.length <= 0) {
      return null;
    }

    const currData: XboxSearch[] = [...responseData.productSummaries];

    const currGame = currData.find((data) => data.productId === storeId);

    if (!currGame) {
      return null;
    }

    const { currencyCode, msrp, listPrice, discountPercentage, endDate } =
      currGame.specificPrices.purchaseable[0];
    return {
      gamepass: "optimalSatisfyingPassId" in currGame ? true : false,
      offerEndDate: this.offerEndDate(discountPercentage, endDate),
      currency: currencyCode,
      discount_percent: discountPercentage.toFixed(),
      initial_price: msrp.toFixed(),
      final_price: listPrice.toFixed(),
    };
  }
}

import { xboxStoreConfig } from "./../utils.model";
import { parseUrl, replaceSteam, replaceXbox } from "../../utils/game.utils";
import { Store } from "../store.class";
import { StoreInfo } from "../../types";

import { XboxRating, XboxSearch, XboxSearchImage } from "../types";

export class XboxStore extends Store {
  constructor() {
    super("Xbox");
  }

  private searchUrl(term: string) {
    const queryParsed = parseUrl(term, "-");
    return `SEARCH_GAMES_SEARCHQUERY=${queryParsed}_PLAYWITH=PC`;
  }

  private singleSearchUrl(id: string) {
    return `https://emerald.xboxservices.com/xboxcomfd/productDetails/${id}?locale=es-CL&enableFullDetail=true`;
  }

  private singleRatingSearchUrl(id: string) {
    return `https://emerald.xboxservices.com/xboxcomfd/productDetails/${id}?locale=en-US&enableFullDetail=true`;
  }

  private xboxSearchImage(images: XboxSearchImage) {
    return (
      images.boxArt?.url ?? images.poster?.url ?? images.superHeroArt?.url ?? ""
    );
  }

  private allXboxImages(images: XboxSearchImage) {
    let allImages = [
      images.boxArt?.url,
      images.poster?.url,
      images.superHeroArt?.url,
      ...images.screenshots?.map((image) => image.url),
    ].filter(Boolean) as string[];

    return allImages.map((image) => {
      return { url: image };
    });
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
    const ids = currData
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query.trim().toLowerCase()) ||
          query.trim().toLowerCase().includes(item.title.toLowerCase()),
      )
      .map((item) => item.productId);

    const games = await this.findDetail(ids);

    const filterGames = games
      .map((el) => {
        return { ...el, gameName: replaceSteam(replaceXbox(el.gameName)) };
      })
      .filter(
        (game) => game.infoPrice.initial_price && game.infoPrice.final_price,
      )
      .filter((game) => !game.gameName.toLowerCase().includes("xbox"));

    return { store: this.name, type: this.type, storeInfo: filterGames };
  }

  async singleNameScrapeFromName(query: string, currency: string) {
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
      return { store: this.name, type: this.type, storeInfo: null };
    }

    const currData: XboxSearch[] = [...responseData.productSummaries];

    const xboxGame = currData.find(
      (game) =>
        replaceSteam(replaceXbox(game.title)).trim().toLowerCase() ===
        query.trim().toLowerCase(),
    );

    if (!xboxGame) {
      return { store: this.name, type: this.type, storeInfo: null };
    }

    const gameDetail = await this.findDetail([xboxGame.productId]);
    let gameFormated = { ...gameDetail[0] };
    gameFormated = {
      ...gameFormated,
      gameName: replaceSteam(replaceXbox(gameFormated.gameName)),
    };

    if (
      gameFormated.gameName.toLowerCase().includes("xbox") ||
      (!gameFormated.infoPrice.initial_price &&
        !gameFormated.infoPrice.final_price) ||
      (gameFormated.infoPrice.initial_price === "0" &&
        gameFormated.infoPrice.final_price === "0")
    ) {
      return { store: this.name, type: this.type, storeInfo: null };
    }

    return { store: this.name, type: this.type, storeInfo: gameFormated };
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

  async findDetail(ids: string[]) {
    const games = [];
    for (const id of ids) {
      const res = await fetch(this.singleSearchUrl(id), {
        headers: xboxStoreConfig.singleGameHeaders,
      });

      const responseData = await res.json();

      if (responseData.productSummaries.length <= 0) {
        continue;
      }

      const currData: XboxSearch[] = [...responseData.productSummaries];

      const currGame = currData.find((data) => data.productId === id);

      if (!currGame) {
        continue;
      }

      const resRating = await fetch(this.singleRatingSearchUrl(id), {
        headers: xboxStoreConfig.singleGameHeaders,
      });
      const responseRating = await resRating.json();

      if (responseRating.productSummaries.length <= 0) {
        continue;
      }

      const currRating: XboxRating[] = [...responseRating.productSummaries];
      const findRating = currRating.find((data) => data.productId === id);

      const {
        categories,
        developerName,
        publisherName,
        shortDescription,
        videos,
        description,
        images,
        productId,
        releaseDate,
        specificPrices,
        title,
        capabilities,

        productKind,
      } = currGame;

      let prices: {
        listPrice: number;
        msrp: number;
        discountPercentage: number;
        currencyCode: string;
        endDate: string;
      } = {
        listPrice: 0,
        msrp: 0,
        discountPercentage: 0,
        currencyCode: "CLP",
        endDate: "",
      };

      if (title.toLowerCase().includes("bundle")) {
        continue;
      }

      if (specificPrices.purchaseable.length > 0) {
        prices = { ...specificPrices.purchaseable[0] };
      }

      const { currencyCode, msrp, listPrice, discountPercentage, endDate } =
        prices;

      const urlTitle = parseUrl(title.toLowerCase(), "-");

      const game = {
        gameName: title,
        url: `https://www.xbox.com/es-CL/games/store/${urlTitle}/${productId}`,
        gamepass: "optimalSatisfyingPassId" in currGame ? true : false,
        offerEndDate: this.offerEndDate(discountPercentage, endDate),
        infoPrice: {
          initial_price: msrp.toFixed(),
          final_price: listPrice.toFixed(),
          discount_percent: discountPercentage.toFixed(),
          currency: currencyCode,
        },
        infoGame: {
          storeId: productId,
          imgStore: this.xboxSearchImage(images),
          storeName: this.name,
          about: shortDescription,
          type: productKind,
          description: this.extractTextFromHtml(description).join("\n"),
          release_date: releaseDate ? releaseDate : "-",
          developer: developerName ? developerName : "-",
          publisher: publisherName ? publisherName : "-",
          screenshots: this.allXboxImages(images),
          videos: videos.map((video) => {
            return {
              url: video.url,
              title: video.title,
              thumbnail: video.previewImage.url,
            };
          }),
          genres: categories.map((category) => category),
          ratings: findRating?.contentRating
            ? [
                {
                  name: findRating.contentRating.boardName,
                  descriptors: findRating.contentRating.descriptors
                    .map((item) => item)
                    .join(", "),
                  rating: findRating.contentRating.rating,
                  imageUrl: findRating.contentRating.imageUri,
                },
              ]
            : null,
          categories: capabilities ? Object.values(capabilities) : [],
        },
      };
      games.push(game);
    }
    return games;
  }
}

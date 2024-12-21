import { calculateDiscountPercent, formatToDecimals } from "./../utils.model";
import { parseUrl, replaceSteam } from "../../utils/game.utils";
import { Store } from "../store.class";
import { PriceOverview, SingleGame, StoreInfo } from "../../types";

import {
  EpicDetail,
  EpicMappingCover,
  EpicOffer,
  EpicScreenshots,
  EpicSearch,
  FreeGamesEpic,
  PromotionsEpicGames,
} from "../types";

export class EpicStore extends Store {
  constructor() {
    super("Epic");
  }

  private searchUrl = (term: string, currency: string) => {
    const queryTerm = parseUrl(term, "+");

    return `https://store.epicgames.com/graphql?operationName=searchStoreQuery&variables=%7B%22allowCountries%22:%22CL%22,%22category%22:%22games%2Fedition%2Fbase%22,%22count%22:40,%22country%22:%22${currency}%22,%22keywords%22:%22${queryTerm}%22,%22locale%22:%22en-EN%22,%22sortBy%22:%22relevancy,viewableDate%22,%22sortDir%22:%22DESC,DESC%22,%22start%22:0,%22tag%22:%22%22,%22withPrice%22:true%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%227d58e12d9dd8cb14c84a3ff18d360bf9f0caa96bf218f2c5fda68ba88d68a437%22%7D%7D`;
  };

  private offerEndDate(lineOffers: EpicOffer): string | null {
    if (lineOffers.appliedRules.length > 0) {
      return lineOffers.appliedRules[0].endDate!;
    }
    return null;
  }

  async scrapeGamesFromSearch(
    term: string,
    currency: string,
  ): Promise<StoreInfo> {
    const res = await fetch(this.searchUrl(term, currency));

    const data = await res.json();

    if (data.data.Catalog.searchStore.elements.length <= 0) {
      return { store: this.name, type: this.type, storeInfo: [] };
    }
    const currData: EpicSearch[] = [...data.data.Catalog.searchStore.elements];

    const searchTermGames = currData.filter(
      (game) =>
        game.title.toLowerCase().includes(term.trim().toLowerCase()) ||
        term.trim().toLowerCase().includes(game.title.toLowerCase()),
    );

    const idsAndNamespaces = searchTermGames.map((game) => {
      return { namespace: game.namespace, id: game.id };
    });

    const gamesDetail = await this.findDetail(idsAndNamespaces);

    const games = gamesDetail.map((el) => {
      return { ...el, gameName: replaceSteam(el.gameName) };
    });

    return { store: this.name, type: this.type, storeInfo: games };
  }

  async scrapeSingleGameFromName(
    term: string,
    currency: string,
  ): Promise<SingleGame> {
    const res = await fetch(this.searchUrl(term, currency));

    const data = await res.json();

    if (data.data.Catalog.searchStore.elements.length <= 0) {
      return { store: this.name, type: this.type, storeInfo: null };
    }
    const currData: EpicSearch[] = [...data.data.Catalog.searchStore.elements];

    const searchTermGames = currData.find(
      (game) => game.title.trim().toLowerCase() === term.trim().toLowerCase(),
    );

    if (!searchTermGames) {
      return { store: this.name, type: this.type, storeInfo: null };
    }

    const gameDetail = await this.findDetail([
      { namespace: searchTermGames.namespace, id: searchTermGames.id },
    ]);
    return { store: this.name, type: this.type, storeInfo: gameDetail[0] };
  }

  async scrapeGameFromUrl(storeId: string) {
    const manipulateId = storeId.split(",");
    const id = manipulateId[0];
    const nameSpace = manipulateId[1];

    const res = await fetch(
      `https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22es-ES%22,%22country%22:%22CL%22,%22offerId%22:%22${id}%22,%22sandboxId%22:%22${nameSpace}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22abafd6e0aa80535c43676f533f0283c7f5214a59e9fae6ebfb37bed1b1bb2e9b%22%7D%7D`,
    );
    const data = await res.json();

    // return data;
    const currData: EpicSearch = { ...data.data.Catalog.catalogOffer };

    const {
      currencyCode,
      discount,
      currencyInfo,
      discountPrice,
      originalPrice,
    } = currData.price.totalPrice;
    const { lineOffers } = currData.price;

    const discount_percent = calculateDiscountPercent(originalPrice, discount);

    const initial_price = formatToDecimals(
      originalPrice,
      currencyInfo.decimals,
    );

    const final_price = formatToDecimals(discountPrice, currencyInfo.decimals);

    const gamePriceData = {
      discount_percent,
      initial_price,
      final_price,
      releaseDate: currData.releaseDate,
      currencyCode,
    };

    const price_overview = this.GamePriceCheck(gamePriceData);
    return {
      offerEndDate: this.offerEndDate(lineOffers[0]),
      currency: price_overview.currency,
      discount_percent: price_overview.discount_percent,
      initial_price: price_overview.initial,
      final_price: price_overview.final,
    };
  }

  async findDetail(ids: { namespace: string; id: string }[]) {
    const games = [];
    for (const id of ids) {
      const res = await fetch(
        `https://store.epicgames.com/graphql?operationName=getCatalogOffer&variables=%7B%22locale%22:%22es-ES%22,%22country%22:%22CL%22,%22offerId%22:%22${id.id}%22,%22sandboxId%22:%22${id.namespace}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22abafd6e0aa80535c43676f533f0283c7f5214a59e9fae6ebfb37bed1b1bb2e9b%22%7D%7D`,
      );
      const data = await res.json();

      const currData: EpicDetail = { ...data.data.Catalog.catalogOffer };

      const {
        catalogNs,
        description,
        developerDisplayName,
        id: storeId,
        keyImages,
        namespace,
        publisherDisplayName,
        longDescription,
        releaseDate,
        tags,
        title,
      } = currData;

      const {
        currencyCode,
        discount,
        currencyInfo,
        discountPrice,
        originalPrice,
      } = currData.price.totalPrice;

      const productId = catalogNs.mappings.find(
        (element) => "productId" in element,
      );

      let extraInfo: {
        imgStore: string | null;
        screenshots: string[] | null;
        slug: string | null;
      } = {
        imgStore: null,
        screenshots: null,
        slug: null,
      };

      if (productId && "productId" in productId) {
        const getGameCover = await fetch(
          `https://egs-platform-service.store.epicgames.com/api/v1/egs/products/${productId.productId}?country=CL&locale=es-ES&store=EGS`,
        );
        const gameCoverData: EpicMappingCover = await getGameCover.json();

        const getScreenshots = await fetch(
          `https://store.epicgames.com/graphql?operationName=getProductHomeConfig&variables=%7B%22locale%22:%22es-ES%22,%22sandboxId%22:%22${namespace}%22%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%225a922bd3e5c84b60a4f443a019ef640b05cb0ae379beb4aca4515bf9812dfcb4%22%7D%7D`,
        );

        const getScreenshotsData: EpicScreenshots = await getScreenshots.json();

        const findScreenshots =
          getScreenshotsData.data.Product.sandbox.configuration.find(
            (element) => "configs" in element,
          );

        if (findScreenshots) {
          extraInfo.screenshots = [
            ...findScreenshots.configs.keyImages
              .filter((element) => element.type === "featuredMedia")
              .map((element) => element.url),
          ];
        }

        extraInfo.slug =
          "mapping" in gameCoverData && "slug" in gameCoverData.mapping
            ? gameCoverData.mapping.slug
            : null;
        extraInfo.imgStore =
          "media" in gameCoverData && "card16x9" in gameCoverData.media
            ? gameCoverData.media.card16x9.imageSrc
            : null;
      }

      if (!catalogNs.mappings && !extraInfo.slug) {
        continue;
      }
      const urlTitle = extraInfo.slug
        ? extraInfo.slug
        : catalogNs.mappings[0].pageSlug;

      const screenshots = extraInfo.screenshots
        ? extraInfo.screenshots.map((image) => {
            return { url: image };
          })
        : keyImages.map((image) => {
            return { url: image.url };
          });

      const imgStore =
        extraInfo.imgStore ||
        (extraInfo.screenshots ? extraInfo.screenshots[0] : null) ||
        screenshots[0].url;

      const discount_percent = calculateDiscountPercent(
        originalPrice,
        discount,
      );

      const initial_price = formatToDecimals(
        originalPrice,
        currencyInfo.decimals,
      );

      const final_price = formatToDecimals(
        discountPrice,
        currencyInfo.decimals,
      );

      const gamePriceData = {
        discount_percent,
        initial_price,
        final_price,
        releaseDate,
        currencyCode,
      };

      const price_overview = this.GamePriceCheck(gamePriceData);

      const gameDetail = {
        gameName: title,
        url: `https://store.epicgames.com/es-ES/p/${urlTitle}`,

        infoPrice: {
          initial_price: price_overview.initial,
          final_price: price_overview.final,
          discount_percent: price_overview.discount_percent,
          currency: price_overview.currency,
        },
        infoGame: {
          imgStore: imgStore,

          storeId: `${storeId},${namespace}`,
          storeName: this.name,
          about: description ? description : "",
          description: longDescription ? longDescription : "",
          release_date: releaseDate,
          developer: developerDisplayName ? developerDisplayName : "",
          publisher: publisherDisplayName ? publisherDisplayName : "",
          screenshots: screenshots,
          genres: tags
            .filter((tag) => tag.groupName === "genre")
            .map((tag) => tag.name),
          categories: tags
            .filter((category) => category.groupName === "feature")
            .map((category) => category.name),
          ratings: null,
        },
      };

      games.push(gameDetail);
    }
    return games;
  }

  //TODO: Feature para siguientes versiones
  // async scrapeFeaturedSales(currency: string) {
  //   // const topNewReleasesRes = await fetch(
  //   //   `https://store-site-backend-static-ipv4.ak.epicgames.com/storefrontLayout?locale=es-ES&country=${currency}&start=0&count=12`,
  //   // );
  //   // const topNewReleasesData: EpicFeaturedItems =
  //   //   await topNewReleasesRes.json();

  //   // const { modules } =
  //   //   topNewReleasesData.data.Storefront.storefrontModulesPaginated;
  //   // console.log(modules);
  //   // const epicOffers = modules.find(
  //   //   (module) =>
  //   //     module.type === "group" &&
  //   //     module.id.includes("blade") &&
  //   //     module.title.includes("Destacados"),
  //   // ) as GroupFeaturedEpic;

  //   // const topLists = modules.find(
  //   //   (module) =>
  //   //     module.type === "subModules" &&
  //   //     module.id === "module-top-lists" &&
  //   //     module.title === "",
  //   // ) as SubModuleFeaturedEpic;

  //   // const topSellersEpic = topLists.modules.find(
  //   //   (module) =>
  //   //     module.id === "module-content/list-top-sellers" &&
  //   //     module.type === "group" &&
  //   //     module.title === "Más vendidos",
  //   // ) as GroupFeaturedEpic;

  //   // const topWishListed = topLists.modules.find(
  //   //   (module) =>
  //   //     module.id === "module-content/top-wishlisted" &&
  //   //     module.type === "group" &&
  //   //     module.title === "Más deseados que llegarán próximamente",
  //   // ) as GroupFeaturedEpic;
  //   // console.log(epicOffers);
  //   // const epicOfferDetail = await this.findDetail(epicOffers.offers);
  //   // const topSellersEpicDetail = await this.findDetail(topSellersEpic.offers);
  //   // const topWishListedDetail = await this.findDetail(topWishListed.offers);

  //   const featuredGames = {
  //     // epicOffer: epicOfferDetail.map((game) => {
  //     //   return {
  //     //     ...game,
  //     //     type: this.type,
  //     //     store: this.name,
  //     //     feature: "Epic - Oferta destacada",
  //     //   };
  //     // }),
  //     // topSeller: topSellersEpicDetail.map((game) => {
  //     //   return {
  //     //     ...game,
  //     //     type: this.type,
  //     //     store: this.name,
  //     //     feature: "Epic - Más vendidos",
  //     //   };
  //     // }),
  //     // topWishListed: topWishListedDetail.map((game) => {
  //     //   return {
  //     //     ...game,
  //     //     type: this.type,
  //     //     store: this.name,
  //     //     feature: "Epic - Más agregados a la lista de deseados",
  //     //   };
  //     // }),
  //   };
  //   return featuredGames;
  // }

  async freeEpicGame(currency: string) {
    const freeGamesRes = await fetch(
      `https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=es-ES&country=${currency}&allowCountries=${currency}`,
    );
    const freeGamesData: FreeGamesEpic = await freeGamesRes.json();

    const filterFreeGames =
      freeGamesData.data.Catalog.searchStore.elements.filter(
        (element) =>
          element.promotions &&
          this.isEffectiveDate(element.promotions) &&
          element.price.totalPrice.discountPrice === 0,
      );

    const freeGames = await this.findDetail(filterFreeGames);

    return freeGames.map((game) => {
      return {
        ...game,
        type: this.type,
        store: this.name,
        feature: "Epic Free Game",
      };
    });
  }

  private isEffectiveDate(promotions: PromotionsEpicGames): boolean {
    if (promotions === null || promotions.promotionalOffers.length <= 0) {
      return false;
    }

    const now = new Date();
    const start = new Date(
      promotions.promotionalOffers[0].promotionalOffers[0].startDate,
    );
    const end = new Date(
      promotions.promotionalOffers[0].promotionalOffers[0].endDate,
    );

    return now >= start && now <= end;
  }

  private isCoomingSoon(release_date: string) {
    const now = new Date();
    const releaseDate = new Date(release_date);

    return releaseDate >= now;
  }

  private GamePriceCheck(currPrice: {
    releaseDate: string;
    currencyCode: string;
    discount_percent: string;
    final_price: string;
    initial_price: string;
  }) {
    const {
      releaseDate,
      currencyCode,
      discount_percent,
      final_price,
      initial_price,
    } = currPrice;

    let price_overview: PriceOverview = {
      currency: currencyCode,
      discount_percent: discount_percent ?? "0",
      final: final_price,
      initial: initial_price,
    };

    if (!this.isCoomingSoon(releaseDate) && final_price === "0") {
      price_overview.final = "Free";
      price_overview = {
        currency: currencyCode,
        discount_percent: discount_percent ?? "0",
        final: "Gratis",
        initial: initial_price,
      };
    }

    if (this.isCoomingSoon(releaseDate) && final_price === "0") {
      price_overview = {
        currency: currencyCode,
        discount_percent: discount_percent ?? "0",
        final: "Próximamente",
        initial: "Próximamente",
      };
    }

    return price_overview;
  }
}

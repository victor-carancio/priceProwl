import { parseUrl, replaceSteam } from "../../utils/game.utils";
import { Store } from "../store.class";
import { SingleGame, StoreInfo } from "../../types";
import {
  NewreleasesSteamFeatured,
  SpecialsSteamFeatured,
  SteamAppsSearch,
  SteamDetails,
  SteamFeaturedTypeId,
  SteamSearch,
  TopsellerSteamFeatured,
} from "../types";
import { formatToDecimals } from "../utils.model";

export class SteamStore extends Store {
  constructor() {
    super("Steam");
  }

  private searchUrl(term: string) {
    const queryParsed = parseUrl(term, "%20");
    return `https://steamcommunity.com/actions/SearchApps/${queryParsed}`;
  }

  async scrapeGamesFromSearch(
    query: string,
    currency: string,
  ): Promise<StoreInfo> {
    const res = await fetch(this.searchUrl(query));
    const gamesInfo: SteamAppsSearch[] = await res.json();

    if (gamesInfo.length <= 0) {
      return { store: this.name, type: this.type, storeInfo: [] };
    }

    const numberIds = gamesInfo.map((game) => parseInt(game.appid));

    const findGames = await this.findDetail(numberIds, currency);

    const games = findGames.map((game) => {
      return { ...game, gameName: replaceSteam(game.gameName) };
    });

    return { store: this.name, type: this.type, storeInfo: games };
  }

  async scrapeGameFromUrl(storeId: string) {
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${storeId}&filters=price_overview&cc=CL`,
    );
    const data: SteamSearch = await res.json();

    if (storeId in data && "price_overview" in data[storeId].data) {
      const { currency, discount_percent, initial, final } =
        data[storeId].data.price_overview;

      return {
        offerEndDate: null,
        currency: currency,
        discount_percent: discount_percent.toFixed(),
        initial_price: formatToDecimals(initial, 2),
        final_price: formatToDecimals(final, 2),
      };
    }
    return null;
  }
  async idListScrapeGame(storeIds: string[]) {
    const idsToString = storeIds.join(",");

    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${idsToString}&filters=price_overview&cc=CL`,
    );
    const data = await res.json();
    let listOfUpdatedPrice = [];
    for (const storeId of storeIds) {
      if (storeId in data && "price_overview" in data[storeId].data) {
        const { currency, discount_percent, initial, final } =
          data[storeId].data.price_overview;

        const price = {
          storeId,
          offerEndDate: null,
          currency: currency,
          discount_percent: discount_percent.toFixed(),
          initial_price: formatToDecimals(initial, 2),
          final_price: formatToDecimals(final, 2),
        };
        listOfUpdatedPrice.push(price);
      }
    }

    return listOfUpdatedPrice;
  }

  async findDetail(items: number[], currency: string) {
    const gamesFounded = [];

    for (const item of items) {
      const res = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${item}&cc=${currency}&l=spanish`,
      );
      const data: SteamDetails = await res.json();

      if (!("data" in data[item.toFixed(0)])) {
        continue;
      }

      const {
        detailed_description,
        developers,
        genres,
        header_image,

        name,
        is_free,
        publishers,
        ratings,
        release_date,
        screenshots,
        short_description,

        categories,
        pc_requirements,
        supported_languages,
        type,
        website,
      } = data[item.toFixed(0)].data;

      let price_overview: {
        currency: string;
        discount_percent: string;
        final: string;
        initial: string;
      } = {
        currency: "CLP",
        discount_percent: "0",
        final: "0",
        initial: "0",
      };

      if (
        ratings &&
        "steam_germany" in ratings &&
        (ratings.steam_germany?.rating === "BANNED" ||
          ratings.steam_germany?.banned === "1")
      ) {
        continue;
      }

      if (
        !is_free &&
        !release_date.coming_soon &&
        "price_overview" in data[item.toFixed(0)].data
      ) {
        const { initial, final, currency, discount_percent } =
          data[item.toFixed(0)].data.price_overview;
        price_overview = {
          initial: this.formatPrice(initial, currency),
          final: this.formatPrice(final, currency),
          currency: currency,
          discount_percent: this.formatDiscount(discount_percent),
        };
      }

      if (is_free && !("price_overview" in data[item.toFixed(0)].data)) {
        price_overview = {
          initial: "Gratis",
          final: "Gratis",
          currency: "CLP",
          discount_percent: "0",
        };
      }

      if (
        !is_free &&
        release_date.coming_soon &&
        !("price_overview" in data[item.toFixed(0)].data)
      ) {
        price_overview = {
          initial: "Próximamente",
          final: "Próximamente",
          currency: "CLP",
          discount_percent: "0",
        };
      }

      const {
        currency: currencyStore,
        discount_percent,
        final,
        initial,
      } = price_overview;

      const urlTitle = parseUrl(name, "_");

      let currRating = [];

      if (ratings && ratings.esrb && ratings.esrb.descriptors) {
        currRating.push({
          name: "ESRB",
          descriptors: ratings.esrb.descriptors.split("\r\n").join(", "),
          rating: ratings.esrb.rating,
          imageUrl: null,
        });
      }

      if (ratings && ratings.pegi && ratings.pegi.descriptors) {
        currRating.push({
          name: "Pegi",
          descriptors: ratings.pegi.descriptors.split("\r\n").join(", "),
          rating: ratings.pegi.rating,
          imageUrl: null,
        });
      }

      const languages = supported_languages
        ? this.extractTextFromHtml(supported_languages)
            .flatMap((language) => language.split(","))
            .map((item) => item.trim())
            .filter((item) => item && item !== "*")
            .join(", ")
        : "-";

      const game = {
        gameName: name,
        url: `https://store.steampowered.com/app/${item}/${urlTitle}/`,

        infoPrice: {
          initial_price: initial,
          final_price: final,
          discount_percent: discount_percent,
          currency: currencyStore,
        },
        infoGame: {
          storeId: item.toFixed(),
          imgStore: header_image,
          storeName: this.name,
          about: short_description,
          type: type,
          supported_languages: languages,
          website: website,
          pc_requirements: {
            minimum: pc_requirements.minimum
              ? this.extractTextFromTagsHtml(pc_requirements.minimum).join("\n")
              : "-",
            recommended: pc_requirements.recommended
              ? this.extractTextFromTagsHtml(pc_requirements.recommended).join(
                  "\n",
                )
              : "-",
          },
          description:
            this.extractTextFromHtml(detailed_description).join("\n"),
          release_date: release_date.date,
          developer: developers ? developers.join(" ,") : "-",
          publisher: publishers ? publishers.join(" ,") : "-",

          categories: categories
            ? categories.map((category) => category.description)
            : [],
          screenshots: screenshots
            ? screenshots.map((screenshot) => {
                return {
                  url: screenshot.path_full,
                  thumbUrl: screenshot.path_thumbnail,
                };
              })
            : [],

          genres: genres ? genres.map((genre) => genre.description) : [],
          ratings: ratings ? currRating : null,
        },
      };

      gamesFounded.push(game);
    }

    return gamesFounded;
  }

  private formatPrice(price: string | number, currency: string) {
    if (typeof price === "string") {
      return "-";
    }
    return currency === "CLP" ? formatToDecimals(price, 2) : price.toFixed();
  }

  private formatDiscount(discount: string | number) {
    return typeof discount === "number" ? discount.toFixed() : "-";
  }

  async scrapeSingleGameFromName(
    term: string,
    currency: string,
  ): Promise<SingleGame> {
    const res = await fetch(this.searchUrl(term));
    const gamesInfo: SteamAppsSearch[] = await res.json();

    if (gamesInfo.length <= 0) {
      return { store: this.name, type: this.type, storeInfo: null };
    }

    const searchTermGames = gamesInfo.find(
      (game) => game.name.trim().toLowerCase() === term.trim().toLowerCase(),
    );

    if (!searchTermGames) {
      return { store: this.name, type: this.type, storeInfo: null };
    }

    const gameDetail = await this.findDetail(
      [parseInt(searchTermGames.appid)],
      currency,
    );

    let gameFormat = {
      ...gameDetail[0],
      gameName: replaceSteam(gameDetail[0].gameName),
    };

    return { store: this.name, type: this.type, storeInfo: gameFormat };
  }
  async scrapeFeaturedSales(currency: string) {
    const specialRes = await fetch(
      `https://store.steampowered.com/api/getappsincategory/?category=cat_specials&cc=${currency}&l=english`,
    );
    const specialData: SpecialsSteamFeatured = await specialRes.json();

    const newreleasesRes = await fetch(
      `https://store.steampowered.com/api/getappsincategory/?category=cat_newreleases&cc=${currency}&l=spanish`,
    );
    const newreleasesData: NewreleasesSteamFeatured =
      await newreleasesRes.json();

    const topsellerRes = await fetch(
      `https://store.steampowered.com/api/getappsincategory/?category=cat_topsellers&cc=${currency}&l=spanish`,
    );
    const topsellerData: TopsellerSteamFeatured = await topsellerRes.json();

    const topSellerIds = [
      ...this.getFeaturedIds(topsellerData.tabs.viewall.items),
    ];

    const specialsIds = [
      ...this.getFeaturedIds(specialData.tabs.viewall.items),
    ];

    const newreleasesIds = [
      ...this.getFeaturedIds(newreleasesData.tabs.topsellers.items),
    ];

    const topSellers = await this.findDetail(topSellerIds, currency);
    const specials = await this.findDetail(specialsIds, currency);
    const releases = await this.findDetail(newreleasesIds, currency);

    const featuredGames = {
      topsellers: topSellers.map((topseller) => {
        return {
          ...topseller,
          type: this.type,
          store: this.name,
          feature: "Steam - Más vendidos",
        };
      }),
      specials: specials.map((special) => {
        return {
          ...special,
          type: this.type,
          store: this.name,
          feature: "Steam - Ofertas especiales",
        };
      }),
      newReleases: releases.map((release) => {
        return {
          ...release,
          type: this.type,
          store: this.name,
          feature: "Steam - Nuevos Lanzamientos",
        };
      }),
    };

    return featuredGames;
  }

  getFeaturedIds(items: SteamFeaturedTypeId[]) {
    return items.filter((item) => item.type === 0).map((item) => item.id);
  }

  // formatedFeatured(items: SteamFeaturedItems[]) {
  //   return items.map((item) => {
  //     const urlTitle = parseUrl(item.name, "_");
  //     return {
  //       storeId: item.id,
  //       gameName: item.name,
  //       url: `https://store.steampowered.com/app/${item.id}/${urlTitle}/`,
  //       imgStore: item.header_image,
  //       discount_percent: item.discount_percent.toFixed(),
  //       currency: item.currency,
  //       initial_price:
  //         item.currency === "CL"
  //           ? formatToDecimals(item.original_price, 2)
  //           : item.original_price.toFixed(),
  //       final_price:
  //         item.currency === "CL"
  //           ? formatToDecimals(item.final_price, 2)
  //           : item.final_price.toFixed(),
  //     };
  //   });
  // }
}

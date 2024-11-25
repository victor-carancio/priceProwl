export interface EpicSearch {
  title: string;
  id: string;
  namespace: string;
  catalogNs: {
    mappings: {
      pageSlug: string;
    }[];
  };
  keyImages: {
    url: string;
  }[];
  price: {
    totalPrice: {
      discount: number;
      currencyCode: string;
      originalPrice: number;
      discountPrice: number;
      currencyInfo: { decimals: number };
    };
    lineOffers: EpicOffer[];
  };
}

export interface EpicDetail {
  title: string;
  id: string;
  namespace: string;
  catalogNs: {
    mappings: {
      pageSlug: string;
    }[];
  };
  keyImages: {
    url: string;
  }[];
  price: {
    totalPrice: {
      discount: number;
      currencyCode: string;
      originalPrice: number;
      discountPrice: number;
      currencyInfo: { decimals: number };
    };
  };
  description: string;
  releaseDate: string;
  tags: { groupName: string; name: string }[];
  developerDisplayName: string | null;
  publisherDisplayName: string | null;
  longDescription: string | null;
}

export interface EpicOffer {
  appliedRules: {
    endDate?: string;
  }[];
}
export interface XboxSearch {
  title: string;
  productId: string;
  images: XboxSearchImage;
  categories: string[];
  description: string;
  shortDescription: string;
  developerName: string;
  publisherName: string;
  releaseDate: string;
  productKind: string;
  capabilities: {
    [key: string]: string;
  };

  videos: { url: string; title: string; previewImage: { url: string } }[];
  specificPrices: {
    purchaseable: {
      listPrice: number;
      msrp: number;
      discountPercentage: number;
      currencyCode: string;
      endDate: string;
    }[];
  };
}

export interface XboxRating {
  productId: string;
  contentRating: {
    boardName: string;
    imageUri: string;
    descriptors: string[];
    rating: string;
    ratingAge: number;
  };
}
export interface XboxSearchImage {
  boxArt?: {
    url: string;
  };
  poster?: {
    url: string;
  };
  superHeroArt?: {
    url: string;
  };
  screenshots: {
    url: string;
  }[];
}
export interface SteamAppsSearch {
  appid: string;
  name: string;
}

export interface SteamSearch {
  [appid: string]: {
    success: boolean;
    data: {
      name: string;
      price_overview: {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
      };
    };
  };
}

export interface SteamSearchImg {
  [appid: string]: {
    success: boolean;
    data: {
      header_image: string;
    };
  };
}

export interface SteamFeaturedCategories {
  specials: {
    items: SteamFeaturedItems[];
  };
  top_sellers: {
    items: SteamFeaturedItems[];
  };
}

// export interface SteamFeaturedItems {
//   id: number;
//   name: string;
//   discounted: boolean;
//   discount_percent: number;
//   original_price: number;
//   final_price: number;
//   currency: string;
//   discount_expiration: number;
//   header_image: string;
// }

export interface SpecialsSteamFeatured {
  tabs: {
    // topsellers: SteamFeaturedItems;
    viewall: SteamFeaturedItems;
  };
}

export interface TopsellerSteamFeatured {
  tabs: {
    viewall: SteamFeaturedItems;
    // specials: SteamFeaturedItems;
  };
}

export interface NewreleasesSteamFeatured {
  tabs: {
    // viewall: SteamFeaturedItems;
    topsellers: SteamFeaturedItems;
  };
}

export interface SteamFeaturedItems {
  items: SteamFeaturedTypeId[];
}

export interface SteamFeaturedTypeId {
  type: number;
  id: number;
}

export interface SteamDetails {
  [appid: string]: {
    success: boolean;
    data: {
      detailed_description: string;
      short_description: string;
      name: string;
      price_overview: {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
      };
      header_image: string;
      developers: string[];
      publishers: string[];
      is_free: boolean;
      genres: { description: string }[];
      metacritic?: {
        score: number;
        url: string;
      };
      screenshots: {
        path_thumbnail: string;
        path_full: string;
      }[];
      movies: {
        id: number;
        name: string;
        thumbnail: string;
        webm: {
          max: string;
        };
      }[];
      release_date: {
        coming_soon: boolean;
        date: string;
      };
      type: string;
      supported_languages: string;
      website: string;
      pc_requirements: {
        minimum: string;
        recommended: string;
      };
      categories: {
        description: string;
      }[];
      ratings: {
        esrb?: {
          required_age: string;
        };
        pegi?: {
          rating: string;
          descriptors: string;
        };
        steam_germany?: {
          rating_generated: string;
          rating: string;
          banned: string;
        };
      };
    };
  };
}

export interface EpicFeaturedItems {
  data: {
    Storefront: {
      storefrontModulesPaginated: {
        modules: GroupFeaturedEpic[] | SubModuleFeaturedEpic[];
      };
    };
  };
}

export interface GroupFeaturedEpic {
  id: string;
  type: string;
  title: string;
  offers: {
    id: string;
    namespace: string;
  }[];
}

export interface SubModuleFeaturedEpic {
  id: string;
  type: string;
  title: string;
  modules: GroupFeaturedEpic[];
}

export interface FreeGamesEpic {
  data: {
    Catalog: {
      searchStore: {
        elements: {
          id: string;
          namespace: string;
          price: {
            totalPrice: {
              discountPrice: number;
            };
          };
          promotions: PromotionsEpicGames | null;
        }[];
      };
    };
  };
}

export interface PromotionsEpicGames {
  promotionalOffers: {
    promotionalOffers: {
      startDate: string;
      endDate: string;
    }[];
  }[];
}

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

export interface EpicOffer {
  appliedRules: {
    endDate?: string;
  }[];
}
export interface XboxSearch {
  title: string;
  productId: string;
  images: XboxSearchImage;
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

export interface EpicSearch {
  title: string;
  id: string;
  catalogNs: {
    mappings: {
      pageSlug: string;
    }[];
  };
  price: {
    totalPrice: {
      discount: number;
      currencyCode: string;
      originalPrice: number;
      discountPrice: number;
      currencyInfo: { decimals: number };
    };
  };
}

export interface XboxSearch {
  title: string;
  productId: string;
  specificPrices: {
    purchaseable: {
      listPrice: number;
      msrp: number;
      discountPercentage: number;
      currencyCode: string;
    }[];
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

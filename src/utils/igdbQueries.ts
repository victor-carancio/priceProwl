import { IGDBQueries } from "../types";

const iGDBQueries: IGDBQueries = {
  otherQueries:
    ";fields name,first_release_date, storyline,summary,genres.name,version_title,keywords.name,",
  // screenshotsQueries:
  //   "screenshots.url,screenshots.width,screenshots.height,screenshots.image_id,",
  artworkdsQueries:
    "artworks.url, artworks.width,artworks.height,artworks.image_id,",
  involvedCompaniesQueries:
    "involved_companies.developer,involved_companies.porting,involved_companies.publisher,involved_companies.supporting,involved_companies.company.name,involved_companies.company.start_date,involved_companies.company.country,involved_companies.company.logo.url,involved_companies.company.logo.width,involved_companies.company.logo.height,involved_companies.company.logo.image_id,",
  coverQueries: "cover.url,cover.width,cover.height,cover.image_id,",
  releaseDatesQueries:
    "release_dates.date,release_dates.region,release_dates.category,release_dates.platform.name, release_dates.platform.abbreviation,release_dates.platform.alternative_name,release_dates.platform.platform_logo.url,release_dates.platform.platform_logo.width,release_dates.platform.platform_logo.height,release_dates.platform.platform_logo.image_id,",
  // languageSupportsQueries:
  //   "language_supports.language.name,language_supports.language.locale,language_supports.language.native_name,",
  platformsQueries:
    "platforms.name,platforms.abbreviation,platforms.alternative_name,platforms.platform_logo.url,platforms.platform_logo.width,platforms.platform_logo.height,platforms.platform_logo.image_id,",
  gameEnginesQueries: "game_engines.name,",
  alternativeNamesQueries: "alternative_names.name,alternative_names.comment,",
  videosQueries: "videos.name,videos.video_id;",
  // age_ratingsQueries:
  //   "age_ratings.rating,age_ratings.synopsis,age_ratings.rating_cover_url,age_ratings.category;",
  filtersQueries: "where platforms = (6,163) & category = (0,3,8,9,10,11);",
};

export const gameIgdbQueries: string = Object.values(iGDBQueries).join("");

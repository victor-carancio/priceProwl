import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Documentacion Api Price Prowler",
    version: "1.0.0",
  },
  servers: [
    {
      description: "Development Server (local)",
      url: "http://localhost:3000/api/v1",
    },
    {
      description: "Production",
      url: "http://ec2-18-224-46-85.us-east-2.compute.amazonaws.com/api/v1",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "authcookie",
      },
    },
    schemas: {
      login: {
        type: "object",
        required: ["identifier", "password"],
        properties: {
          identifier: {
            type: "string",
            example: "user@example.com",
          },
          password: {
            type: "string",
            example: "12345678",
          },
        },
      },
      signUp: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            example: "user@example.com",
          },
          password: {
            type: "string",
            example: "12345678",
          },
          username: {
            type: "string",
            example: "user43",
          },
        },
      },
      authResponse: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              userId: {
                type: "integer",
                example: "1",
              },
              email: {
                type: "string",
                example: "user@example.com",
              },
              username: {
                type: "string",
                example: "user",
              },
            },
          },
        },
      },
      updateUserResponse: {
        type: "object",
        properties: {
          msg: {
            type: "string",
            example: "Profile info updated",
          },
          user: {
            type: "object",
            properties: {
              userId: {
                type: "integer",
                example: "1",
              },
              email: {
                type: "string",
                example: "user@example.com",
              },
              username: {
                type: "string",
                example: "user",
              },
            },
          },
        },
      },
      updateUserInfo: {
        type: "object",
        properties: {
          email: {
            type: "string",
            example: "user@example.com",
          },
          password: {
            type: "string",
            example: "12345678",
          },
          username: {
            type: "string",
            example: "user43",
          },
        },
      },
      deleteUserResponse: {
        type: "object",
        properties: {
          msg: {
            type: "string",
            example: "account deleted",
          },
        },
      },
      addToWishlist: {
        type: "object",
        properties: {
          gameId: {
            type: "integer",
            example: 2,
          },
        },
      },
      scraperGamePrices: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "game name",
          },
        },
      },
      gameResponse: {
        type: "object",
        properties: {
          nbHts: {
            type: "integer",
            description: "Number of games found",
            example: "1",
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/gamesFromScraper",
            },
          },
        },
      },
      gameResponseDB: {
        type: "object",
        properties: {
          nbHts: {
            type: "integer",
            description: "Number of games found",
            example: "1",
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/gamesFromDB",
            },
          },
        },
      },
      gamesFromScraper: {
        type: "object",
        properties: {
          gameName: {
            type: "string",
            example: "Resident Evil 2",
          },
          stores: {
            type: "array",
            items: {
              $ref: "#/components/schemas/storesScraper",
            },
          },
          infoGame: {
            type: "array",
            items: {
              $ref: "#/components/schemas/infoGame",
            },
          },
        },
      },
      gamesFromDB: {
        type: "object",
        properties: {
          gameName: {
            type: "string",
            example: "Resident Evil 2",
          },
          platform: {
            type: "string",
            example: "pc",
          },
          createdAt: {
            type: "string",
            example: "2024-07-17T21:35:10.807Z",
          },
          updatedAt: {
            type: "string",
            example: "2024-07-17T21:35:10.807Z",
          },
          stores: {
            type: "array",
            items: {
              $ref: "#/components/schemas/storesDB",
            },
          },
          infoGame: {
            type: "array",
            items: {
              $ref: "#/components/schemas/infoList",
            },
          },
        },
      },
      storesScraper: {
        type: "object",
        properties: {
          store: {
            type: "string",
            example: "Steam",
          },
          url: {
            type: "string",
            example: "https://store.example.com",
          },
          gamepass: {
            oneOf: [
              {
                type: "boolean",
              },
              {
                type: "null",
              },
            ],
            example: "null",
          },
          edition: {
            type: "string",
            example: "Standard",
          },

          info: {
            type: "object",
            $ref: "#/components/schemas/infoScraper",
          },
        },
      },
      infoScraper: {
        type: "object",
        properties: {
          discount_percent: {
            type: "string",
            example: "-",
          },
          initial_price: {
            type: "string",
            example: "CLP$32.200",
          },
          final_price: {
            type: "string",
            example: "CLP$32.200",
          },
        },
      },
      storesDB: {
        type: "object",
        properties: {
          store: {
            type: "string",
            example: "Steam",
          },
          url: {
            type: "string",
            example: "https://store.example.com",
          },
          gamepass: {
            oneOf: [
              {
                type: "boolean",
              },
              {
                type: "null",
              },
            ],
            example: "null",
          },
          edition: {
            type: "string",
            example: "Standard",
          },
          createdAt: {
            type: "string",
            example: "2024-07-17T21:35:10.807Z",
          },
          updatedAt: {
            type: "string",
            example: "2024-07-17T21:35:10.807Z",
          },
          game_id: {
            type: "integer",
            example: "2",
          },
          info: {
            type: "object",
            $ref: "#/components/schemas/infoDB",
          },
        },
      },
      infoDB: {
        type: "object",
        properties: {
          discount_percent: {
            type: "string",
            example: "-",
          },
          initial_price: {
            type: "string",
            example: "CLP$32.200",
          },
          final_price: {
            type: "string",
            example: "CLP$32.200",
          },
          createdAt: {
            type: "string",
            example: "2024-07-17T21:35:10.807Z",
          },
          updatedAt: {
            type: "string",
            example: "2024-07-17T21:35:10.807Z",
          },
          offer_end_date: {
            oneOf: [
              {
                type: "string",
              },
              {
                type: "null",
              },
            ],
            example: "null",
          },
          store_game_id: {
            type: "integer",
            example: "2",
          },
        },
      },
      infoGame: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "56078",
          },
          alternative_names: {
            type: "array",
            items: {
              $ref: "#/components/schemas/alternative_names",
            },
          },
          artworks: {
            type: "array",
            items: {
              $ref: "#/components/schemas/image",
            },
          },
          cover: {
            $ref: "#/components/schemas/image",
          },
          first_release_date: {
            $ref: "#/components/schemas/unixTimeStampDate",
          },
          game_engines: {
            type: "array",
            items: {
              $ref: "#/components/schemas/propertiesNameAndId",
            },
          },
          genres: {
            type: "array",
            items: {
              $ref: "#/components/schemas/propertiesNameAndId",
            },
          },
          involved_companies: {
            type: "array",
            items: {
              $ref: "#/components/schemas/involved_companies",
            },
          },
          keywords: {
            type: "array",
            items: {
              $ref: "#/components/schemas/propertiesNameAndId",
            },
          },
          name: {
            type: "string",
            example: "Resident Evil 2",
          },
          platforms: {
            type: "array",
            items: {
              $ref: "#/components/schemas/platforms",
            },
          },
          release_dates: {
            type: "array",
            items: {
              $ref: "#/components/schemas/release_dates",
            },
          },
          storyline: {
            type: "string",
            example: "Players join rookie police officer Leon Kennedy...",
          },
          summary: {
            type: "string",
            example: "Resident Evil 2 is a remake of 1998's Resident Evil 2",
          },
          videos: {
            type: "array",
            items: {
              $ref: "#/components/schemas/videos",
            },
          },
        },
      },
      infoList: {
        type: "object",
        properties: {
          game_id: {
            type: "integer",
            example: "2",
          },
          info_game_id: {
            type: "integer",
            example: "19686",
          },
          info_game: {
            $ref: "#/components/schemas/infoGameISO",
          },
        },
      },
      infoGameISO: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "56078",
          },
          alternative_names: {
            type: "array",
            items: {
              $ref: "#/components/schemas/alternative_names",
            },
          },
          artworks: {
            type: "array",
            items: {
              $ref: "#/components/schemas/image",
            },
          },
          cover: {
            $ref: "#/components/schemas/image",
          },
          first_release_date: {
            $ref: "#/components/schemas/isoDateFormat",
          },
          game_engines: {
            type: "array",
            items: {
              $ref: "#/components/schemas/propertiesNameAndId",
            },
          },
          genres: {
            type: "array",
            items: {
              $ref: "#/components/schemas/propertiesNameAndId",
            },
          },
          involved_companies: {
            type: "array",
            items: {
              $ref: "#/components/schemas/involved_companiesISO",
            },
          },
          keywords: {
            type: "array",
            items: {
              $ref: "#/components/schemas/propertiesNameAndId",
            },
          },
          name: {
            type: "string",
            example: "Resident Evil 2",
          },
          platforms: {
            type: "array",
            items: {
              $ref: "#/components/schemas/platforms",
            },
          },
          release_dates: {
            type: "array",
            items: {
              $ref: "#/components/schemas/release_datesISO",
            },
          },
          storyline: {
            type: "string",
            example: "Players join rookie police officer Leon Kennedy...",
          },
          summary: {
            type: "string",
            example: "Resident Evil 2 is a remake of 1998's Resident Evil 2",
          },
          videos: {
            type: "array",
            items: {
              $ref: "#/components/schemas/videos",
            },
          },
        },
      },
      alternative_names: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "82970",
          },
          comment: {
            type: "string",
            example: "Alternative title",
          },
          name: {
            type: "type",
            example: "RE2 Remake",
          },
        },
      },
      image: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "5081",
          },
          height: {
            type: "integer",
            example: "1399",
          },
          image_id: {
            type: "string",
            example: "qqrtgvipdy3t5xgc5u6q",
          },
          url: {
            type: "string",
            example:
              "//images.igdb.com/igdb/image/upload/t_thumb/qqrtgvipdy3t5xgc5u6q.jpg",
          },
          width: {
            type: "integer",
            example: "958",
          },
        },
      },
      propertiesNameAndId: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      involved_companies: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "184693",
          },
          company: {
            $ref: "#/components/schemas/company",
          },
          developer: {
            type: "boolean",
            example: "false",
          },
          porting: {
            type: "boolean",
            example: "false",
          },
          publisher: {
            type: "boolean",
            example: "true",
          },
          supporting: {
            type: "boolean",
            example: "false",
          },
        },
      },
      involved_companiesISO: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "184693",
          },
          company: {
            $ref: "#/components/schemas/companyISO",
          },
          developer: {
            type: "boolean",
            example: "false",
          },
          porting: {
            type: "boolean",
            example: "false",
          },
          publisher: {
            type: "boolean",
            example: "true",
          },
          supporting: {
            type: "boolean",
            example: "false",
          },
        },
      },
      company: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "37",
          },
          country: {
            type: "integer",
            example: "392",
          },
          logo: {
            $ref: "#/components/schemas/image",
          },
          name: {
            type: "string",
            example: "Capcom",
          },
          start_date: {
            $ref: "#/components/schemas/unixTimeStampDate",
          },
        },
      },
      companyISO: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "37",
          },
          country: {
            type: "integer",
            example: "392",
          },
          logo: {
            $ref: "#/components/schemas/image",
          },
          name: {
            type: "string",
            example: "Capcom",
          },
          start_date: {
            $ref: "#/components/schemas/isoDateFormat",
          },
        },
      },
      platforms: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "6",
          },
          abbreviation: {
            type: "string",
            example: "PC",
          },
          alternative_name: {
            type: "string",
            example: "mswin",
          },
          name: {
            type: "string",
            example: "PC (Microsoft Windows",
          },
          platform_logo: {
            $ref: "#/components/schemas/image",
          },
        },
      },
      videos: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "2",
          },
          name: {
            type: "string",
            example: "Trailer",
          },
          video_id: {
            type: "string",
            description: "Id of youtube video",
            example: "ZcW6W-xVl-8",
          },
        },
      },
      release_dates: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "12323",
          },
          category: {
            type: "integer",
            example: "0",
          },
          date: {
            $ref: "#/components/schema/unixTimeStampDate",
          },
          region: {
            type: "integer",
            example: "2",
          },
          platform: {
            $ref: "#/components/schema/platforms",
          },
        },
      },
      release_datesISO: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "12323",
          },
          category: {
            type: "integer",
            example: "0",
          },
          date: {
            $ref: "#/components/schema/isoDateFormat",
          },
          region: {
            type: "integer",
            example: "2",
          },
          platform: {
            $ref: "#/components/schema/platforms",
          },
        },
      },

      unixTimeStampDate: {
        type: "integer",
        example: "435324",
      },
      isoDateFormat: {
        type: "string",
        example: "",
      },
    },
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  failOnErrors: true,
  apis: ["./src/routes/*.ts"],
};

export default swaggerJSDoc(swaggerOptions);

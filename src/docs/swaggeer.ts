import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Documentacion Api Price Prowler",
    version: "1.0.0",
  },
  servers: [
    {
      description:
        process.env.NODE_ENV === "production"
          ? "Production"
          : "Development Server (local)",
      url:
        process.env.NODE_ENV === "production"
          ? "https://priceprowler.vcaranciodev.online/api/v1"
          : "http://localhost:3000/api/v1",
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
              $ref: "#/components/schemas/gameShortInfo",
            },
          },
        },
      },
      gameShortInfo: {
        type: "object",
        properties: {
          id: {
            type: "number",
            example: 1,
          },
          gameName: {
            type: "string",
            example: "Resident Evil 2",
          },
          platform: {
            type: "string",
            example: "PC",
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
              $ref: "#/components/schemas/storesShortInfo",
            },
          },
        },
      },
      storesShortInfo: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: 1,
          },
          store: {
            type: "string",
            example: "Steam",
          },
          type: {
            type: "string",
            example: "official",
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
          info_price: {
            type: "object",
            $ref: "#/components/schemas/infoPrice",
          },
          infoGame: {
            type: "object",
            $ref: "#/components/schemas/shortInfoGame",
          },
        },
      },
      infoPrice: {
        type: "object",
        properties: {
          id: {
            type: "number",
            example: 1,
          },
          discount_percent: {
            type: "string",
            example: "0",
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
          currency: {
            type: "string",
            example: "CLP",
          },
          store_game_id: {
            type: "integer",
            example: "2",
          },
        },
      },
      shortInfoGame: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "56078",
          },
          storeIdGame: {
            type: "string",
            example: "282530",
          },
          genres: {
            type: "array",
            items: {
              type: "string",
              example: "Acción",
            },
          },
          imgStore: {
            type: "string",
            example:
              "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/883710/header.jpg?t=1728438541",
          },
          categories: {
            type: "array",
            items: {
              type: "string",
              example: "Un jugador",
            },
          },
          about: {
            type: "string",
            example: "Players join rookie police officer Leon Kennedy...",
          },
          description: {
            type: "string",
            example: "Resident Evil 2 is a remake of 1998's Resident Evil 2",
          },
          release_date: {
            type: "string",
            example: "25 ENE 2019",
          },
        },
      },
      gameDetail: {
        type: "object",
        properties: {
          id: {
            type: "number",
            example: 1,
          },
          gameName: {
            type: "string",
            example: "Resident Evil 2",
          },
          platform: {
            type: "string",
            example: "PC",
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
              $ref: "#/components/schemas/storesCompleteInfo",
            },
          },
        },
      },
      storesCompleteInfo: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: 1,
          },
          store: {
            type: "string",
            example: "Steam",
          },
          type: {
            type: "string",
            example: "official",
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
          info_price: {
            type: "object",
            $ref: "#/components/schemas/infoPrice",
          },
          infoGame: {
            type: "object",
            $ref: "#/components/schemas/completeInfoGame",
          },
        },
      },
      completeInfoGame: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: "56078",
          },
          storeIdGame: {
            type: "string",
            example: "282530",
          },
          genres: {
            type: "array",
            items: {
              type: "string",
              example: "Acción",
            },
          },
          categories: {
            type: "array",
            items: {
              type: "string",
              example: "Un jugador",
            },
          },
          imgStore: {
            type: "string",
            example:
              "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/883710/header.jpg?t=1728438541",
          },
          about: {
            type: "string",
            example: "Players join rookie police officer Leon Kennedy...",
          },
          description: {
            type: "string",
            example: "Resident Evil 2 is a remake of 1998's Resident Evil 2",
          },
          release_date: {
            type: "string",
            example: "25 ENE 2019",
          },
          developer: {
            type: "string",
            example: "CAPCOM CO., LTD.",
          },
          publisher: {
            type: "string",
            example: "CAPCOM CO., LTD.",
          },
          pc_requirements: {
            oneOf: [
              {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                    example: 10,
                  },
                  minimum: {
                    type: "string",
                    example:
                      "Mínimo:Requiere un procesador y un sistema operativo de 64 bitsSO: Windows 10 (64 bit)Procesador: AMD Ryzen 3 1200 / Intel Core i5-7500Memoria: 8 GB de RAMGráficos: AMD Radeon RX 560 with 4GB VRAM /...",
                  },
                  recommended: {
                    type: "string",
                    example:
                      "Recomendado:Requiere un procesador y un sistema operativo de 64 bitsSO: Windows 10 (64 bit)/Windows 11 (64 bit)Procesador: AMD Ryzen 5 3600 / Intel Core i7 8700Memoria: 16 GB...",
                  },
                },
              },
              {
                type: "null",
              },
            ],
          },
          screenshots: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  example: "1",
                },
                url: {
                  type: "string",
                  example:
                    "https://store-images.s-microsoft.com/image/apps.38246.71571739681700792.c61fa2d7-3d69-4edf-8e51-accc41d47823.9197ae9d-181d-44ff-a98d-7f64086f509e",
                },
                thumbUrl: {
                  type: "string",
                  example: "-",
                },
                info_game_id: {
                  type: "number",
                  example: 2,
                },
              },
            },
          },
          supportedLanguages: {
            type: "string",
            example:
              "Inglés*, Francés*, Italiano*, Alemán*, Español de España*, Árabe, Japonés*",
          },
          videos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  example: "1",
                },
                title: {
                  type: "string",
                  example: "Launch Trailer",
                },
                url: {
                  type: "string",
                  example:
                    "https://store-images.s-microsoft.com/image/apps.38246.71571739681700792.c61fa2d7-3d69-4edf-8e51-accc41d47823.9197ae9d-181d-44ff-a98d-7f64086f509e",
                },
                thumbnail: {
                  type: "string",
                  example: "-",
                },
                info_game_id: {
                  type: "number",
                  example: 2,
                },
              },
            },
          },
          website: {
            type: "string",
            example: "https://www.residentevil.com/re4/",
          },
          ratings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "number",
                  example: 37,
                },
                name: {
                  type: "string",
                  example: "ESRB",
                },
                descriptors: {
                  type: "string",
                  example: "Blood and Gore, Intense Violence, Strong Language",
                },
                rating: {
                  type: "string",
                  example: "m",
                },
                imageUrl: {
                  oneOf: [
                    {
                      type: "null",
                      example: "null",
                    },
                    {
                      type: "string",
                      example: "www.image.com/qwertyimage.jpg",
                    },
                  ],
                },
                info_game: {
                  type: "number",
                  example: 2,
                },
              },
            },
          },
        },
      },
      gameSearchFilters: {
        type: "object",
        properties: {
          nbHts: {
            type: "number",
            example: 10,
          },
          currentPage: {
            type: "number",
            example: 1,
          },
          totalGames: {
            type: "number",
            example: 57,
          },
          totalPages: {
            type: "number",
            example: 6,
          },
          games: {
            type: "array",
            items: {
              $ref: "#/components/schemas/gameShortInfo",
            },
          },
        },
      },
      featuredGames: {
        type: "array",
        items: {
          type: "object",
          properties: {
            feature: {
              type: "string",
              example: "Steam - Más vendidos",
            },
            games: {
              type: "array",
              items: {
                $ref: "#/components/schemas/gameShortInfo",
              },
            },
          },
        },
      },
      categories: {
        type: "object",
        properties: {
          nbHts: {
            type: "number",
            example: 2,
          },
          categories: {
            type: "array",
            items: {
              type: "string",
              example: "Un jugador",
            },
          },
        },
      },
      genres: {
        type: "object",
        properties: {
          nbHts: {
            type: "number",
            example: 2,
          },
          genres: {
            type: "array",
            items: {
              type: "string",
              example: "Rol",
            },
          },
        },
      },
      // login: {
      //   type: "object",
      //   required: ["identifier", "password"],
      //   properties: {
      //     identifier: {
      //       type: "string",
      //       example: "user@example.com",
      //     },
      //     password: {
      //       type: "string",
      //       example: "12345678",
      //     },
      //   },
      // },
      // signUp: {
      //   type: "object",
      //   required: ["email", "password"],
      //   properties: {
      //     email: {
      //       type: "string",
      //       example: "user@example.com",
      //     },
      //     password: {
      //       type: "string",
      //       example: "12345678",
      //     },
      //     username: {
      //       type: "string",
      //       example: "user43",
      //     },
      //   },
      // },
      // authResponse: {
      //   type: "object",
      //   properties: {
      //     user: {
      //       type: "object",
      //       properties: {
      //         userId: {
      //           type: "integer",
      //           example: "1",
      //         },
      //         email: {
      //           type: "string",
      //           example: "user@example.com",
      //         },
      //         username: {
      //           type: "string",
      //           example: "user",
      //         },
      //       },
      //     },
      //   },
      // },
      // updateUserResponse: {
      //   type: "object",
      //   properties: {
      //     msg: {
      //       type: "string",
      //       example: "Profile info updated",
      //     },
      //     user: {
      //       type: "object",
      //       properties: {
      //         userId: {
      //           type: "integer",
      //           example: "1",
      //         },
      //         email: {
      //           type: "string",
      //           example: "user@example.com",
      //         },
      //         username: {
      //           type: "string",
      //           example: "user",
      //         },
      //       },
      //     },
      //   },
      // },
      // updateUserInfo: {
      //   type: "object",
      //   properties: {
      //     email: {
      //       type: "string",
      //       example: "user@example.com",
      //     },
      //     password: {
      //       type: "string",
      //       example: "12345678",
      //     },
      //     username: {
      //       type: "string",
      //       example: "user43",
      //     },
      //   },
      // },
      // deleteUserResponse: {
      //   type: "object",
      //   properties: {
      //     msg: {
      //       type: "string",
      //       example: "account deleted",
      //     },
      //   },
      // },
      // addToWishlist: {
      //   type: "object",
      //   properties: {
      //     gameId: {
      //       type: "integer",
      //       example: 2,
      //     },
      //   },
      // },
    },
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  failOnErrors: true,
  apis: ["./src/routes/*.ts"],
};

export default swaggerJSDoc(swaggerOptions);

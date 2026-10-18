const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Gestion de Flotte de Transport",
    version: "1.0.0",
    description: `
API RESTful pour la gestion complète d'une flotte de camions, remorques, pneus, trajets et règles de maintenance préventive.

### Rôles et Autorisations :
- **ADMIN** : Accès complet (gestion des ressources, utilisateurs, trajets, règles et alertes de maintenance).
- **CHAUFFEUR** : Consultation de ses propres trajets assignés (\`/api/mes-trajets\`), démarrage (\`/api/trajets/:id/demarrer\`) et clôture avec saisie de fin de trajet (\`/api/trajets/:id/terminer\`).

### Authentification :
L'API utilise des tokens **JWT**. Après connexion via \`POST /api/login\`, transmettez le token dans le header HTTP :
\`Authorization: Bearer <votre_token>\`
    `,
    contact: {
      name: "Support Flotte API",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: "Serveur de Développement Local",
    },
  ],
  tags: [
    {
      name: "Authentification & Utilisateurs",
      description: "Connexion JWT et création des comptes utilisateurs",
    },
    {
      name: "Camions (Trucks)",
      description: "Gestion des camions de la flotte",
    },
    { name: "Remorques", description: "Gestion des remorques" },
    {
      name: "Pneus (Tires)",
      description: "Gestion et suivi de l’usure des pneus",
    },
    {
      name: "Règles de Maintenance",
      description:
        "Configuration des seuils kilométriques de maintenance (Admin)",
    },
    {
      name: "Maintenances",
      description: "Gestion des alertes et interventions de maintenance",
    },
    {
      name: "Trajets",
      description: "Création, assignation, suivi et clôture des trajets",
    },
    { name: "Système", description: "Vérification de santé de l’API" },
    {
      name: "Rapports & Statistiques",
      description:
        "Rapports de consommation, kilométrage et alertes de maintenance (Admin)",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Entrez votre token JWT au format: Bearer <token>",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Message détaillant l'erreur" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6618d3b5f92a1c0012e8b91a" },
          firstName: { type: "string", example: "Karim" },
          lastName: { type: "string", example: "Benali" },
          email: { type: "string", example: "karim@flotte.com" },
          role: {
            type: "string",
            enum: ["admin", "chauffeur"],
            example: "chauffeur",
          },
          statue: {
            type: "string",
            enum: ["actif", "suspendu"],
            example: "actif",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "admin@flotte.com",
          },
          password: { type: "string", format: "password", example: "admin123" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          login: { type: "string", example: "login succesfully" },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      CreateUserInput: {
        type: "object",
        required: ["firstName", "lastName", "email", "password", "role"],
        properties: {
          firstName: { type: "string", example: "Mohamed" },
          lastName: { type: "string", example: "Alami" },
          email: {
            type: "string",
            format: "email",
            example: "mohamed.alami@flotte.com",
          },
          password: { type: "string", minLength: 6, example: "secret123" },
          role: {
            type: "string",
            enum: ["admin", "chauffeur"],
            example: "chauffeur",
          },
        },
      },
      Truck: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6618d3b5f92a1c0012e8b91b" },
          immatriculation: { type: "string", example: "12345-A-26" },
          marque: { type: "string", example: "Volvo FH 500" },
          kilometrageTotal: { type: "number", example: 125000 },
          statut: {
            type: "string",
            enum: ["disponible", "en_trajet", "en_maintenance"],
            example: "disponible",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateTruckInput: {
        type: "object",
        required: ["immatriculation", "marque", "kilometrageTotal"],
        properties: {
          immatriculation: { type: "string", example: "12345-A-26" },
          marque: { type: "string", example: "Volvo FH 500" },
          kilometrageTotal: { type: "number", minimum: 0, example: 125000 },
        },
      },
      UpdateTruckInput: {
        type: "object",
        properties: {
          immatriculation: { type: "string", example: "12345-A-26" },
          marque: { type: "string", example: "Volvo FH 500" },
          kilometrageTotal: { type: "number", minimum: 0, example: 130000 },
          statut: {
            type: "string",
            enum: ["disponible", "en_trajet", "en_maintenance"],
            example: "disponible",
          },
        },
      },
      Remorque: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6618d3b5f92a1c0012e8b91c" },
          immatriculation: { type: "string", example: "98765-B-10" },
          type: { type: "string", example: "Frigorifique" },
          kilometrageTotal: { type: "number", example: 85000 },
          statut: {
            type: "string",
            enum: ["disponible", "en_trajet", "en_maintenance"],
            example: "disponible",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateRemorqueInput: {
        type: "object",
        required: ["immatriculation", "type", "kilometrageTotal"],
        properties: {
          immatriculation: { type: "string", example: "98765-B-10" },
          type: { type: "string", example: "Frigorifique" },
          kilometrageTotal: { type: "number", minimum: 0, example: 85000 },
        },
      },
      UpdateRemorqueInput: {
        type: "object",
        properties: {
          immatriculation: { type: "string", example: "98765-B-10" },
          type: { type: "string", example: "Bâchée" },
          kilometrageTotal: { type: "number", minimum: 0, example: 90000 },
          statut: {
            type: "string",
            enum: ["disponible", "en_trajet", "en_maintenance"],
            example: "disponible",
          },
        },
      },
      Tire: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6618d3b5f92a1c0012e8b91d" },
          camion: {
            oneOf: [
              { type: "string", example: "6618d3b5f92a1c0012e8b91b" },
              { $ref: "#/components/schemas/Truck" },
            ],
          },
          position: { type: "string", example: "Avant-Gauche" },
          kilometrageUsure: { type: "number", example: 15400 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateTireInput: {
        type: "object",
        required: ["camion", "position", "kilometrageUsure"],
        properties: {
          camion: {
            type: "string",
            description: "ID MongoDB du camion associé",
            example: "6618d3b5f92a1c0012e8b91b",
          },
          position: { type: "string", example: "Avant-Gauche" },
          kilometrageUsure: { type: "number", minimum: 0, example: 10000 },
        },
      },
      UpdateTireInput: {
        type: "object",
        properties: {
          camion: { type: "string", example: "6618d3b5f92a1c0012e8b91b" },
          position: { type: "string", example: "Arrière-Droit" },
          kilometrageUsure: { type: "number", minimum: 0, example: 18000 },
        },
      },
      MaintenanceRule: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6618d3b5f92a1c0012e8b91e" },
          type: {
            type: "string",
            enum: ["vidange", "revision", "changement_pneu"],
            example: "vidange",
          },
          periodiciteKm: { type: "number", example: 20000 },
          description: {
            type: "string",
            example: "Vidange complète moteur tous les 20 000 km",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateMaintenanceRuleInput: {
        type: "object",
        required: ["type", "periodiciteKm", "description"],
        properties: {
          type: {
            type: "string",
            enum: ["vidange", "revision", "changement_pneu"],
            example: "vidange",
          },
          periodiciteKm: { type: "number", minimum: 1, example: 20000 },
          description: {
            type: "string",
            example: "Vidange complète moteur tous les 20 000 km",
          },
        },
      },
      UpdateMaintenanceRuleInput: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["vidange", "revision", "changement_pneu"],
            example: "vidange",
          },
          periodiciteKm: { type: "number", minimum: 1, example: 25000 },
          description: {
            type: "string",
            example: "Vidange moteur tous les 25 000 km",
          },
        },
      },
      Maintenance: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6618d3b5f92a1c0012e8b91f" },
          camion: { type: "string", example: "6618d3b5f92a1c0012e8b91b" },
          remorque: { type: "string", example: "6618d3b5f92a1c0012e8b91c" },
          pneu: { type: "string", example: "6618d3b5f92a1c0012e8b91d" },
          type: {
            type: "string",
            enum: ["vidange", "revision", "changement_pneu"],
            example: "vidange",
          },
          statut: {
            type: "string",
            enum: ["alerte_declenchee", "resolue"],
            example: "alerte_declenchee",
          },
          kilometrageAuDeclenchement: { type: "number", example: 120500 },
          dateDeclenchement: { type: "string", format: "date-time" },
          dateResolution: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateMaintenanceInput: {
        type: "object",
        required: ["type", "kilometrageAuDeclenchement"],
        properties: {
          camion: { type: "string", example: "6618d3b5f92a1c0012e8b91b" },
          remorque: { type: "string", example: "6618d3b5f92a1c0012e8b91c" },
          pneu: { type: "string", example: "6618d3b5f92a1c0012e8b91d" },
          type: {
            type: "string",
            enum: ["vidange", "revision", "changement_pneu"],
            example: "vidange",
          },
          kilometrageAuDeclenchement: {
            type: "number",
            minimum: 0,
            example: 120500,
          },
        },
      },
      UpdateMaintenanceInput: {
        type: "object",
        properties: {
          statut: {
            type: "string",
            enum: ["alerte_declenchee", "resolue"],
            example: "resolue",
          },
          dateResolution: {
            type: "string",
            format: "date-time",
            example: "2026-10-15T10:30:00.000Z",
          },
        },
      },
      Trajet: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6618d3b5f92a1c0012e8b920" },
          siteDepart: { type: "string", example: "Casablanca" },
          siteArrivee: { type: "string", example: "Tanger Med" },
          marchandise: { type: "string", example: "Composants électroniques" },
          dateDebutPrevue: {
            type: "string",
            format: "date-time",
            example: "2026-10-20T08:00:00.000Z",
          },
          dateFinPrevue: {
            type: "string",
            format: "date-time",
            example: "2026-10-20T18:00:00.000Z",
          },
          chauffeur: {
            oneOf: [
              { type: "string", example: "6618d3b5f92a1c0012e8b91a" },
              { $ref: "#/components/schemas/User" },
            ],
          },
          camion: {
            oneOf: [
              { type: "string", example: "6618d3b5f92a1c0012e8b91b" },
              { $ref: "#/components/schemas/Truck" },
            ],
          },
          remorque: {
            oneOf: [
              { type: "string", example: "6618d3b5f92a1c0012e8b91c" },
              { $ref: "#/components/schemas/Remorque" },
            ],
          },
          statut: {
            type: "string",
            enum: ["a_faire", "en_cours", "termine"],
            example: "a_faire",
          },
          kilometrageDepart: { type: "number", example: 125000 },
          kilometrageArrivee: { type: "number", example: 125350 },
          volumeGasoil: { type: "number", example: 98.5 },
          coutGasoil: { type: "number", example: 1280.5 },
          remarquesVehicule: {
            type: "string",
            example: "Trajet fluide, aucun incident.",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateTrajetInput: {
        type: "object",
        required: [
          "siteDepart",
          "siteArrivee",
          "marchandise",
          "dateDebutPrevue",
          "dateFinPrevue",
          "chauffeur",
          "camion",
          "remorque",
        ],
        properties: {
          siteDepart: { type: "string", example: "Casablanca" },
          siteArrivee: { type: "string", example: "Tanger Med" },
          marchandise: { type: "string", example: "Composants automobiles" },
          dateDebutPrevue: {
            type: "string",
            format: "date-time",
            example: "2026-10-20T08:00:00.000Z",
          },
          dateFinPrevue: {
            type: "string",
            format: "date-time",
            example: "2026-10-20T18:00:00.000Z",
          },
          chauffeur: {
            type: "string",
            description: "ID MongoDB du chauffeur",
            example: "6618d3b5f92a1c0012e8b91a",
          },
          camion: {
            type: "string",
            description: "ID MongoDB du camion disponible",
            example: "6618d3b5f92a1c0012e8b91b",
          },
          remorque: {
            type: "string",
            description: "ID MongoDB de la remorque disponible",
            example: "6618d3b5f92a1c0012e8b91c",
          },
        },
      },
      UpdateTrajetInput: {
        type: "object",
        properties: {
          siteDepart: { type: "string", example: "Casablanca" },
          siteArrivee: { type: "string", example: "Marrakech" },
          marchandise: { type: "string", example: "Produits agroalimentaires" },
          dateDebutPrevue: { type: "string", format: "date-time" },
          dateFinPrevue: { type: "string", format: "date-time" },
          chauffeur: { type: "string", example: "6618d3b5f92a1c0012e8b91a" },
          camion: { type: "string", example: "6618d3b5f92a1c0012e8b91b" },
          remorque: { type: "string", example: "6618d3b5f92a1c0012e8b91c" },
          statut: {
            type: "string",
            enum: ["a_faire", "en_cours", "termine"],
            example: "en_cours",
          },
          kilometrageDepart: { type: "number", minimum: 0 },
          kilometrageArrivee: { type: "number", minimum: 0 },
          volumeGasoil: { type: "number", minimum: 0 },
          coutGasoil: { type: "number", minimum: 0 },
          remarquesVehicule: { type: "string" },
        },
      },
      DemarrerTrajetInput: {
        type: "object",
        required: ["kilometrageDepart"],
        properties: {
          kilometrageDepart: { type: "number", minimum: 0, example: 125000 },
        },
      },
      TerminerTrajetInput: {
        type: "object",
        required: ["kilometrageArrivee", "volumeGasoil", "coutGasoil"],
        properties: {
          kilometrageArrivee: { type: "number", minimum: 0, example: 125420 },
          volumeGasoil: { type: "number", minimum: 0, example: 110 },
          coutGasoil: { type: "number", minimum: 0, example: 1450 },
          remarquesVehicule: {
            type: "string",
            example: "Vibration légère constatée sur l’essieu arrière.",
          },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Système"],
        summary: "Vérifier la santé de l’API",
        description: "Vérifie que le serveur Express répond correctement.",
        responses: {
          200: {
            description: "API fonctionnelle",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "API de gestion de flotte opérationnelle !",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/login": {
      post: {
        tags: ["Authentification & Utilisateurs"],
        summary: "Connexion d’un utilisateur (Admin ou Chauffeur)",
        description:
          "Authentifie un utilisateur avec son email et son mot de passe. Retourne un token JWT.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Connexion réussie",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          403: {
            description: "Compte suspendu",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Email ou mot de passe incorrect",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Erreur interne du serveur",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/api/users": {
      post: {
        tags: ["Authentification & Utilisateurs"],
        summary: "Créer un nouvel utilisateur (Admin uniquement)",
        description:
          "Permet à un administrateur d’enregistrer un nouvel utilisateur (admin ou chauffeur).",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Utilisateur créé avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "user created with succes",
                    },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          401: { description: "Non authentifié" },
          403: { description: "Accès interdit (réservé aux admins)" },
        },
      },
    },

    "/api/trucks": {
      post: {
        tags: ["Camions (Trucks)"],
        summary: "Créer un camion",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTruckInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Camion créé avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Truck created successfully",
                    },
                    truck: { $ref: "#/components/schemas/Truck" },
                  },
                },
              },
            },
          },
          409: {
            description: "Immatriculation déjà existante",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Camions (Trucks)"],
        summary: "Lister tous les camions",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste des camions récupérée avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    trucks: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Truck" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/trucks/{id}": {
      get: {
        tags: ["Camions (Trucks)"],
        summary: "Obtenir les détails d’un camion",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID MongoDB du camion",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Camion trouvé",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    truck: { $ref: "#/components/schemas/Truck" },
                  },
                },
              },
            },
          },
          404: { description: "Camion non trouvé" },
        },
      },
      put: {
        tags: ["Camions (Trucks)"],
        summary: "Mettre à jour un camion",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTruckInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Camion mis à jour",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Truck updated successfully",
                    },
                    truck: { $ref: "#/components/schemas/Truck" },
                  },
                },
              },
            },
          },
          404: { description: "Camion non trouvé" },
          409: { description: "Immatriculation déjà existante" },
        },
      },
      delete: {
        tags: ["Camions (Trucks)"],
        summary: "Supprimer un camion",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Camion supprimé",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Truck deleted successfully",
                    },
                  },
                },
              },
            },
          },
          404: { description: "Camion non trouvé" },
        },
      },
    },

    "/api/remorques": {
      post: {
        tags: ["Remorques"],
        summary: "Créer une remorque",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateRemorqueInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Remorque créée avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Remorque created successfully",
                    },
                    remorque: { $ref: "#/components/schemas/Remorque" },
                  },
                },
              },
            },
          },
          409: { description: "Immatriculation déjà existante" },
        },
      },
      get: {
        tags: ["Remorques"],
        summary: "Lister toutes les remorques",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste des remorques",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    remorques: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Remorque" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/remorques/{id}": {
      get: {
        tags: ["Remorques"],
        summary: "Obtenir une remorque par ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Détails de la remorque",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    remorque: { $ref: "#/components/schemas/Remorque" },
                  },
                },
              },
            },
          },
          404: { description: "Remorque non trouvée" },
        },
      },
      put: {
        tags: ["Remorques"],
        summary: "Mettre à jour une remorque",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateRemorqueInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Remorque mise à jour",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Remorque updated successfully",
                    },
                    remorque: { $ref: "#/components/schemas/Remorque" },
                  },
                },
              },
            },
          },
          404: { description: "Remorque non trouvée" },
          409: { description: "Immatriculation déjà existante" },
        },
      },
      delete: {
        tags: ["Remorques"],
        summary: "Supprimer une remorque",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Remorque supprimée",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Remorque deleted successfully",
                    },
                  },
                },
              },
            },
          },
          404: { description: "Remorque non trouvée" },
        },
      },
    },

    "/api/tires": {
      post: {
        tags: ["Pneus (Tires)"],
        summary: "Enregistrer un nouveau pneu pour un camion",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTireInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Pneu créé",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Tire created successfully",
                    },
                    tire: { $ref: "#/components/schemas/Tire" },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Pneus (Tires)"],
        summary: "Lister tous les pneus",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste des pneus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    tires: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Tire" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/tires/{id}": {
      get: {
        tags: ["Pneus (Tires)"],
        summary: "Obtenir les détails d’un pneu",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Détails du pneu",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    tire: { $ref: "#/components/schemas/Tire" },
                  },
                },
              },
            },
          },
          404: { description: "Pneu non trouvé" },
        },
      },
      put: {
        tags: ["Pneus (Tires)"],
        summary: "Mettre à jour un pneu",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTireInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Pneu mis à jour",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Tire updated successfully",
                    },
                    tire: { $ref: "#/components/schemas/Tire" },
                  },
                },
              },
            },
          },
          404: { description: "Pneu non trouvé" },
        },
      },
      delete: {
        tags: ["Pneus (Tires)"],
        summary: "Supprimer un pneu",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Pneu supprimé",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Tire deleted successfully",
                    },
                  },
                },
              },
            },
          },
          404: { description: "Pneu non trouvé" },
        },
      },
    },

    "/api/regles-maintenance": {
      post: {
        tags: ["Règles de Maintenance"],
        summary: "Créer une règle de maintenance préventive",
        description:
          "Exemple: Vidange tous les 20 000 km, Révision tous les 50 000 km, Changement de pneu tous les 40 000 km.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateMaintenanceRuleInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Règle créée avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Maintenance rule created successfully",
                    },
                    rule: { $ref: "#/components/schemas/MaintenanceRule" },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Règles de Maintenance"],
        summary: "Lister toutes les règles de maintenance",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste des règles",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    rules: {
                      type: "array",
                      items: { $ref: "#/components/schemas/MaintenanceRule" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/regles-maintenance/{id}": {
      get: {
        tags: ["Règles de Maintenance"],
        summary: "Obtenir une règle de maintenance par ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Détails de la règle",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    rule: { $ref: "#/components/schemas/MaintenanceRule" },
                  },
                },
              },
            },
          },
          404: { description: "Règle non trouvée" },
        },
      },
      put: {
        tags: ["Règles de Maintenance"],
        summary: "Mettre à jour une règle de maintenance",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateMaintenanceRuleInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Règle mise à jour",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Maintenance rule updated successfully",
                    },
                    rule: { $ref: "#/components/schemas/MaintenanceRule" },
                  },
                },
              },
            },
          },
          404: { description: "Règle non trouvée" },
        },
      },
      delete: {
        tags: ["Règles de Maintenance"],
        summary: "Supprimer une règle de maintenance",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Règle supprimée",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Maintenance rule deleted successfully",
                    },
                  },
                },
              },
            },
          },
          404: { description: "Règle non trouvée" },
        },
      },
    },

    "/api/maintenances": {
      post: {
        tags: ["Maintenances"],
        summary: "Créer un enregistrement de maintenance",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateMaintenanceInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Maintenance créée",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Maintenance created successfully",
                    },
                    maintenance: { $ref: "#/components/schemas/Maintenance" },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Maintenances"],
        summary: "Lister toutes les maintenances",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste des maintenances",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    maintenances: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Maintenance" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/maintenances/{id}": {
      get: {
        tags: ["Maintenances"],
        summary: "Obtenir une maintenance par ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Détails de la maintenance",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    maintenance: { $ref: "#/components/schemas/Maintenance" },
                  },
                },
              },
            },
          },
          404: { description: "Maintenance non trouvée" },
        },
      },
      put: {
        tags: ["Maintenances"],
        summary: "Mettre à jour une maintenance (ex: résoudre une alerte)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateMaintenanceInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Maintenance mise à jour",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Maintenance updated successfully",
                    },
                    maintenance: { $ref: "#/components/schemas/Maintenance" },
                  },
                },
              },
            },
          },
          404: { description: "Maintenance non trouvée" },
        },
      },
      delete: {
        tags: ["Maintenances"],
        summary: "Supprimer une maintenance",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Maintenance supprimée",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Maintenance deleted successfully",
                    },
                  },
                },
              },
            },
          },
          404: { description: "Maintenance non trouvée" },
        },
      },
    },

    "/api/maintenances/check-truck/{truckId}": {
      get: {
        tags: ["Maintenances"],
        summary: "Vérifier l’état de maintenance d’un camion",
        description:
          "Vérifie si les seuils kilométriques (vidange, révision, usure des pneus) ont été atteints pour ce camion et déclenche des alertes si nécessaire.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "truckId",
            in: "path",
            required: true,
            description: "ID MongoDB du camion à vérifier",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Rapport de vérification",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    camion: { type: "string", example: "12345-A-26" },
                    kilometrageTotal: { type: "number", example: 125000 },
                    alertes: {
                      type: "array",
                      items: { type: "string" },
                      example: ["Alerte: Vidange nécessaire"],
                    },
                  },
                },
              },
            },
          },
          404: { description: "Camion non trouvé" },
        },
      },
    },

    "/api/trajets": {
      post: {
        tags: ["Trajets"],
        summary: "Créer et assigner un trajet (Admin)",
        description:
          "Vérifie automatiquement la disponibilité du camion, de la remorque et du chauffeur, ainsi que l’absence d’alerte de maintenance bloquante avant de planifier le trajet.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTrajetInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Trajet créé avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Trajet created successfully",
                    },
                    trajet: { $ref: "#/components/schemas/Trajet" },
                  },
                },
              },
            },
          },
          404: { description: "Chauffeur, camion ou remorque introuvable" },
          409: {
            description: "Conflit de disponibilité ou véhicule en maintenance",
          },
        },
      },
      get: {
        tags: ["Trajets"],
        summary: "Lister tous les trajets (Admin)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Liste de tous les trajets",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    trajets: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Trajet" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/mes-trajets": {
      get: {
        tags: ["Trajets"],
        summary: "Consulter ses trajets assignés (Chauffeur)",
        description:
          "Retourne la liste des trajets assignés au chauffeur connecté via son token JWT.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Trajets du chauffeur",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    trajets: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Trajet" },
                    },
                  },
                },
              },
            },
          },
          403: { description: "Accès réservé aux chauffeurs" },
        },
      },
    },

    "/api/trajets/{id}": {
      get: {
        tags: ["Trajets"],
        summary: "Détails d’un trajet (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Détails du trajet",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    trajet: { $ref: "#/components/schemas/Trajet" },
                  },
                },
              },
            },
          },
          404: { description: "Trajet non trouvé" },
        },
      },
      put: {
        tags: ["Trajets"],
        summary: "Mettre à jour un trajet (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTrajetInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Trajet mis à jour",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Trajet updated successfully",
                    },
                    trajet: { $ref: "#/components/schemas/Trajet" },
                  },
                },
              },
            },
          },
          404: { description: "Trajet non trouvé" },
        },
      },
      delete: {
        tags: ["Trajets"],
        summary: "Supprimer un trajet (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Trajet supprimé",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Trajet deleted successfully",
                    },
                  },
                },
              },
            },
          },
          404: { description: "Trajet non trouvé" },
        },
      },
    },

    "/api/trajets/{id}/demarrer": {
      patch: {
        tags: ["Trajets"],
        summary: "Démarrer un trajet (Chauffeur)",
        description:
          'Permet au chauffeur assigné de démarrer le trajet en renseignant le kilométrage de départ. Met à jour le statut du trajet en "en_cours" et les véhicules en "en_trajet".',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DemarrerTrajetInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Trajet démarré avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Trajet démarré avec succès",
                    },
                    trajet: { $ref: "#/components/schemas/Trajet" },
                  },
                },
              },
            },
          },
          400: { description: "Kilométrage ou statut invalide" },
          403: {
            description: "Non autorisé (trajet non assigné à ce chauffeur)",
          },
          404: { description: "Trajet non trouvé" },
        },
      },
    },

    "/api/trajets/{id}/terminer": {
      patch: {
        tags: ["Trajets"],
        summary: "Clôturer un trajet avec données de fin (Chauffeur)",
        description:
          'Permet au chauffeur de saisir le kilométrage d’arrivée, la consommation de carburant et les remarques. Calcule les totaux, remet les véhicules en "disponible" et déclenche les vérifications de maintenance préventive.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TerminerTrajetInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Trajet terminé avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Trajet terminé avec succès",
                    },
                    trajet: { $ref: "#/components/schemas/Trajet" },
                    distanceParcourue: { type: "number", example: 350 },
                    consommationMoyenne: {
                      type: "number",
                      example: 28.14,
                      description: "L/100km",
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Kilométrage d’arrivée inférieur au départ ou statut incohérent",
          },
          403: { description: "Non autorisé" },
          404: { description: "Trajet non trouvé" },
        },
      },
    },
    "/api/users/{id}/suspendre": {
      patch: {
        tags: ["Authentification & Utilisateurs"],
        summary: "Suspendre un compte utilisateur (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de l'utilisateur à suspendre",
          },
        ],
        responses: {
          200: { description: "Compte suspendu avec succès" },
          400: {
            description:
              "Compte déjà suspendu ou tentative de suspendre son propre compte",
          },
          403: { description: "Accès réservé aux administrateurs" },
          404: { description: "Utilisateur introuvable" },
        },
      },
    },
    "/api/users/{id}/activer": {
      patch: {
        tags: ["Authentification & Utilisateurs"],
        summary: "Activer / Réactiver un compte utilisateur (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de l'utilisateur à activer",
          },
        ],
        responses: {
          200: { description: "Compte réactivé avec succès" },
          400: { description: "Compte déjà actif" },
          403: { description: "Accès réservé aux administrateurs" },
          404: { description: "Utilisateur introuvable" },
        },
      },
    },
    "/api/rapports/consommation": {
      get: {
        tags: ["Rapports & Statistiques"],
        summary: "Rapport de consommation de carburant par camion (Admin)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Rapport généré avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    rapport: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          camionId: { type: "string" },
                          immatriculation: {
                            type: "string",
                            example: "12345-A-26",
                          },
                          marque: { type: "string", example: "Volvo" },
                          nombreTrajets: { type: "number", example: 5 },
                          totalDistanceKm: { type: "number", example: 1250 },
                          totalVolumeGasoilLitres: {
                            type: "number",
                            example: 350,
                          },
                          totalCoutGasoilDH: { type: "number", example: 4550 },
                          consommationMoyenneL100km: {
                            type: "number",
                            example: 28,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          403: { description: "Accès réservé aux administrateurs" },
        },
      },
    },
    "/api/rapports/kilometrage": {
      get: {
        tags: ["Rapports & Statistiques"],
        summary: "Rapport du kilométrage total de la flotte (Admin)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Rapport généré avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    rapport: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: { type: "string" },
                          immatriculation: { type: "string" },
                          marque: { type: "string" },
                          kilometrageTotal: { type: "number" },
                          statut: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          403: { description: "Accès réservé aux administrateurs" },
        },
      },
    },
    "/api/rapports/alertes-maintenance": {
      get: {
        tags: ["Rapports & Statistiques"],
        summary: "Rapport des alertes de maintenance actives (Admin)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Rapport généré avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    totalAlertes: { type: "number", example: 2 },
                    alertes: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
          403: { description: "Accès réservé aux administrateurs" },
        },
      },
    },
  },
};

/**
 * Configure Swagger UI sur l'application Express
 * @param {import('express').Application} app
 */
function setupSwagger(app) {
  // Option d'affichage propre
  const options = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Documentation API - Gestion de Flotte",
  };

  // Route pour la documentation interactive
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options),
  );

  // Route pour exporter le JSON Swagger brut (utile pour Postman / Insomnia)
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });

  const port = process.env.PORT || 3000;
  console.log(
    `📖 Swagger documentation disponible sur http://localhost:${port}/api/docs`,
  );
}

module.exports = {
  swaggerDocument,
  setupSwagger,
};

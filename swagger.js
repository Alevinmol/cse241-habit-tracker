const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Habit Tracker API",
    description: "API for tracking daily habits with OAuth2 and JWT Authentication",
    version: "1.0.0"
  },
  host: "cse241-habit-tracker.onrender.com", // Change to deployed URL if needed
  schemes: ["http", "https"], // Support HTTPS if deployed
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token with Bearer prefix"
      },
      OAuth2: {
        type: "oauth2",
        flows: {
          authorizationCode: {
            authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
            tokenUrl: "https://oauth2.googleapis.com/token",
            scopes: {
              "openid": "OpenID Connect",
              "profile": "Access your profile info",
              "email": "Access your email address"
            }
          }
        }
      }
    }
  },
  security: [{ BearerAuth: [] }] // Apply JWT globally
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/users.js", "./routes/habits.js"]; // Add all relevant route files

swaggerAutogen(outputFile, endpointsFiles, doc);
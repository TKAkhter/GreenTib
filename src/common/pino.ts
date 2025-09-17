import pino from "pino";

const isLocal = import.meta.env.VITE_APP_ENVIRONMENT !== "production";

const logger = pino({
  level: isLocal ? "info" : "silent",
  timestamp: () => new Date().toISOString(),
  browser: {
    formatters: {
      level(label) {
        return { level: label }; // Ensures the log level is displayed as a string
      },
    },
    serialize: true,
    asObject: false,
  },
});

export default logger;

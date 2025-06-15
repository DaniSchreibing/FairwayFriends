import { Counter, Registry, collectDefaultMetrics } from "prom-client";

const register = new Registry();
collectDefaultMetrics({ register });

export const failedLoginAttempts = new Counter({
  name: "auth_failed_login_attempts_total",
  help: "Total number of failed login attempts",
  labelNames: ["email", "reason", "time"], // Optional labels
});

export const successfullLogins = new Counter({
  name: "auth_successful_logins_total",
  help: "Total number of successful logins",
});

register.registerMetric(failedLoginAttempts);
register.registerMetric(successfullLogins);

export { register };

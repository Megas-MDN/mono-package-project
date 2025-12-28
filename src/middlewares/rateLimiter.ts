import rateLimit, { Options } from 'express-rate-limit';

export const createRateLimiter = (options?: Partial<Options>) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: {
      message: 'Muitas tentativas de OTP. Tente novamente após 15 minutos.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    ...options,
  });
};

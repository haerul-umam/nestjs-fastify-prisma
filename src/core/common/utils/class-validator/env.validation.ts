import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function validateConfiguration<T extends object>(
  config: Record<string, unknown>,
  ConfigClass: new () => T,
) {
  const validatedConfig = plainToInstance(ConfigClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export function validateAllConfigurations<
  T extends Record<string, new () => object>,
>(config: Record<string, unknown>, configClasses: T): Record<string, unknown> {
  let result = {};

  for (const key in configClasses) {
    if (Object.prototype.hasOwnProperty.call(configClasses, key)) {
      const ConfigClass = configClasses[key];
      const validatedConfig = validateConfiguration(config, ConfigClass);

      // Merge the validated config into our result
      result = { ...result, ...validatedConfig };
    }
  }

  return result;
}

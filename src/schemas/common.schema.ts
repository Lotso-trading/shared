import { z } from "zod";

export const EthereumAddressSchema = z
  .string()
  .trim()
  .regex(
    /^0x[a-fA-F0-9]{40}$/,
    "Format d'adresse Ethereum/Polygon invalide (doit débuter par 0x suivi de 40 caractères hexadécimaux)"
  )
  .transform((val) => val.toLowerCase());

export const PositiveNumberSchema = z.number().positive("La valeur doit être strictement positive");

export const NonNegativeNumberSchema = z.number().min(0, "La valeur ne peut pas être négative");

export const UnixTimestampSchema = z
  .number()
  .int()
  .min(0, "Le timestamp Unix doit être un entier positif");

export const RatioPercentSchema = z
  .number()
  .min(0, "Le ratio ne peut pas être inférieur à 0")
  .max(1, "Le ratio ne peut pas être supérieur à 1 (100%)");

export const ProbabilityPriceSchema = z
  .number()
  .min(0.0001, "Le prix de cote doit être au minimum de 0.0001")
  .max(0.9999, "Le prix de cote doit être au maximum de 0.9999");

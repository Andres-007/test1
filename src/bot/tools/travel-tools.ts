import { tool } from "ai";
import { z } from "zod";

type CabinClass = "economy" | "premium_economy" | "business" | "first";

function scoreFromSeed(seed: string, min: number, max: number): number {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1_000_003;
  }

  const span = max - min;
  return min + (hash % (span + 1));
}

function travelMonthFromDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "unknown";
  return parsed.toLocaleString("en-GB", { month: "long" });
}

export const travelTools = {
  evaluatePrices: tool({
    description:
      "Compare current flight prices for European routes across multiple airlines.",
    inputSchema: z.object({
      originAirport: z.string().length(3).describe("IATA code, e.g. JFK"),
      destinationAirport: z.string().length(3).describe("IATA code in Europe"),
      departureDate: z.string().describe("ISO date, e.g. 2026-08-04"),
      returnDate: z.string().optional(),
      cabinClass: z
        .enum(["economy", "premium_economy", "business", "first"])
        .default("economy"),
      passengerCount: z.number().int().positive().max(9).default(1),
    }),
    execute: async (input) => {
      const seed = `${input.originAirport}:${input.destinationAirport}:${input.departureDate}:${input.returnDate ?? ""}:${input.cabinClass}:${input.passengerCount}`;
      const basePrice = scoreFromSeed(seed, 120, 980);
      const multipliers: Record<CabinClass, number> = {
        economy: 1,
        premium_economy: 1.35,
        business: 2.4,
        first: 3.6,
      };

      const adjustedBase = Math.round(
        basePrice * multipliers[input.cabinClass] * input.passengerCount,
      );

      const options = [
        {
          airline: "Lufthansa",
          totalPriceEur: adjustedBase,
          estimatedDurationMinutes: scoreFromSeed(`${seed}:LH:dur`, 450, 770),
          stops: scoreFromSeed(`${seed}:LH:stops`, 0, 2),
        },
        {
          airline: "Air France",
          totalPriceEur: adjustedBase + scoreFromSeed(`${seed}:AF`, -45, 90),
          estimatedDurationMinutes: scoreFromSeed(`${seed}:AF:dur`, 470, 810),
          stops: scoreFromSeed(`${seed}:AF:stops`, 0, 2),
        },
        {
          airline: "KLM",
          totalPriceEur: adjustedBase + scoreFromSeed(`${seed}:KL`, -65, 110),
          estimatedDurationMinutes: scoreFromSeed(`${seed}:KL:dur`, 455, 790),
          stops: scoreFromSeed(`${seed}:KL:stops`, 0, 2),
        },
        {
          airline: "Iberia",
          totalPriceEur: adjustedBase + scoreFromSeed(`${seed}:IB`, -80, 130),
          estimatedDurationMinutes: scoreFromSeed(`${seed}:IB:dur`, 495, 860),
          stops: scoreFromSeed(`${seed}:IB:stops`, 0, 2),
        },
      ];

      const sorted = [...options].sort((a, b) => a.totalPriceEur - b.totalPriceEur);

      return {
        query: {
          ...input,
          travelMonth: travelMonthFromDate(input.departureDate),
        },
        currency: "EUR",
        cheapestOption: sorted[0],
        priceSpreadEur:
          sorted[sorted.length - 1].totalPriceEur - sorted[0].totalPriceEur,
        airlines: sorted,
        insight:
          sorted[0].stops === 0
            ? "A nonstop fare is currently available at the lowest price."
            : "The best current fare includes at least one stop.",
      };
    },
  }),

  checkDelays: tool({
    description:
      "Check current delay risk for a European airport or a specific flight number.",
    inputSchema: z.object({
      airportCode: z.string().length(3).optional().describe("IATA airport code"),
      flightNumber: z.string().optional().describe("Airline + number, e.g. AF124"),
      travelDate: z.string().describe("ISO date, e.g. 2026-08-04"),
    }),
    execute: async (input) => {
      const scope = input.flightNumber ?? input.airportCode ?? "GENERIC";
      const seed = `${scope}:${input.travelDate}`;

      const delayProbability = scoreFromSeed(seed, 8, 62);
      const avgDelayMinutes = scoreFromSeed(`${seed}:avg`, 5, 88);
      const operationalStatus =
        delayProbability > 45 ? "disrupted" : delayProbability > 25 ? "busy" : "normal";

      return {
        query: input,
        status: operationalStatus,
        delayProbabilityPercent: delayProbability,
        averageDelayMinutes: avgDelayMinutes,
        recommendation:
          delayProbability >= 40
            ? "Arrive 2.5+ hours before departure and monitor gate updates."
            : "Standard check-in buffer should be sufficient.",
        factors: [
          "ATC congestion window",
          "weather volatility index",
          "carrier on-time trend",
        ],
      };
    },
  }),

  analyzeLayovers: tool({
    description:
      "Evaluate layover quality for European flight connections based on duration and airport amenities.",
    inputSchema: z.object({
      connectionAirport: z.string().length(3),
      layoverMinutes: z.number().int().min(25).max(900),
      nextLegIsSchengen: z.boolean().default(true),
      needsLoungeAccess: z.boolean().default(false),
    }),
    execute: async (input) => {
      const seed = `${input.connectionAirport}:${input.layoverMinutes}:${input.nextLegIsSchengen}:${input.needsLoungeAccess}`;
      const walkTime = scoreFromSeed(`${seed}:walk`, 8, 31);
      const securityRecheckMinutes = input.nextLegIsSchengen
        ? scoreFromSeed(`${seed}:sec`, 4, 17)
        : scoreFromSeed(`${seed}:sec`, 12, 35);
      const buffer = input.layoverMinutes - walkTime - securityRecheckMinutes;

      const amenities = [
        "quiet_zone",
        "showers",
        "work_pods",
        "family_area",
        "premium_lounge",
      ].filter((_, index) => scoreFromSeed(`${seed}:amenity:${index}`, 0, 1) === 1);

      const rating =
        buffer < 30 ? "risky" : buffer < 75 ? "tight_but_possible" : "comfortable";

      return {
        query: input,
        transferEstimateMinutes: {
          walking: walkTime,
          securityOrPassport: securityRecheckMinutes,
          total: walkTime + securityRecheckMinutes,
        },
        usableBufferMinutes: buffer,
        layoverRating: rating,
        amenities,
        recommendation:
          rating === "risky"
            ? "Consider a longer connection or carry-on only to reduce transfer risk."
            : "Connection timing looks workable for this airport.",
      };
    },
  }),

  findDiscounts: tool({
    description:
      "Find active discounts and seasonal promotions relevant to Europe-bound travel.",
    inputSchema: z.object({
      originRegion: z.enum(["north_america", "europe", "middle_east", "asia"]),
      destinationCountryCode: z.string().length(2),
      targetMonth: z.string().describe("Month name or YYYY-MM"),
      flexibilityDays: z.number().int().min(0).max(10).default(3),
    }),
    execute: async (input) => {
      const seed = `${input.originRegion}:${input.destinationCountryCode}:${input.targetMonth}:${input.flexibilityDays}`;
      const score = scoreFromSeed(seed, 0, 100);

      const offers = [
        {
          provider: "Lufthansa",
          code: "EUROPEWEEK",
          discountPercent: scoreFromSeed(`${seed}:LH:disc`, 6, 18),
          conditions: "Round-trip booking, minimum 7-day stay.",
        },
        {
          provider: "Air France",
          code: "CITYBREAK",
          discountPercent: scoreFromSeed(`${seed}:AF:disc`, 5, 15),
          conditions: "Departure Tuesday-Thursday only.",
        },
        {
          provider: "KLM",
          code: "AMS_CONNECT",
          discountPercent: scoreFromSeed(`${seed}:KL:disc`, 4, 14),
          conditions: "Applies on selected connecting itineraries.",
        },
      ].sort((a, b) => b.discountPercent - a.discountPercent);

      return {
        query: input,
        demandLevel: score > 65 ? "high" : score > 35 ? "moderate" : "low",
        bestOffer: offers[0],
        offers,
        savingsHint:
          input.flexibilityDays >= 3
            ? "Flexible dates increase odds of stacking promo fares with lower demand days."
            : "Small date flexibility may limit promo inventory.",
      };
    },
  }),
};

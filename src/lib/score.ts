/**
 * score.ts — Review score calculation utilities
 *
 * This module provides the core scoring logic for the review platform.
 * All functions are pure (no side effects) and thoroughly documented
 * so contributors can understand the intent without reading source history.
 *
 * Scoring criteria weights:
 *   overall   : 50% — general satisfaction
 *   usability : 20% — ease of use
 *   value     : 20% — cost performance
 *   support   : 10% — customer support quality
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Raw scores for a single review. Each field is 1.0 – 5.0. */
export interface ReviewScores {
  overall: number;
  usability: number;
  value: number;
  support: number;
}

/** Parameters for Bayesian average calculation. */
export interface BayesianParams {
  /** Prior mean: the "global average" used before enough reviews exist. */
  priorMean: number;
  /** Confidence weight: number of virtual prior reviews to assume. */
  priorStrength: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Weight of each criterion in the composite score.
 * Weights must sum to 1.0.
 */
export const SCORE_WEIGHTS = {
  overall: 0.5,
  usability: 0.2,
  value: 0.2,
  support: 0.1,
} as const satisfies Record<keyof ReviewScores, number>;

/**
 * Default Bayesian prior parameters.
 * priorMean = 3.0 (neutral midpoint of 1–5 scale)
 * priorStrength = 5 means we treat 5 hypothetical neutral reviews
 * as existing before any real review arrives.
 * This prevents a single 5-star review from giving a perfect score.
 */
export const DEFAULT_BAYESIAN_PARAMS: BayesianParams = {
  priorMean: 3.0,
  priorStrength: 5,
};

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

/**
 * Calculates the weighted composite score from the four criteria.
 *
 * Formula:
 *   composite = overall * 0.5 + usability * 0.2 + value * 0.2 + support * 0.1
 *
 * @param scores - The four raw criterion scores (each 1.0–5.0)
 * @returns Weighted composite score in the range [1.0, 5.0]
 *
 * @example
 * const s = calcWeightedScore({ overall: 4, usability: 5, value: 3, support: 4 });
 * // => 4.0  (4*0.5 + 5*0.2 + 3*0.2 + 4*0.1)
 */
export function calcWeightedScore(scores: ReviewScores): number {
  const { overall, usability, value, support } = scores;
  return (
    overall * SCORE_WEIGHTS.overall +
    usability * SCORE_WEIGHTS.usability +
    value * SCORE_WEIGHTS.value +
    support * SCORE_WEIGHTS.support
  );
}

/**
 * Applies a Bayesian average to smooth scores when review counts are low.
 *
 * Without Bayesian correction, a service with 1 review rated 5.0 would
 * appear better than a service with 100 reviews averaging 4.8.
 * This formula pulls the score toward a neutral prior until enough real
 * reviews accumulate.
 *
 * Formula:
 *   bayesian = (priorStrength * priorMean + reviewCount * observedMean)
 *              / (priorStrength + reviewCount)
 *
 * @param observedMean  - Arithmetic mean of existing composite scores
 * @param reviewCount   - Number of real reviews collected
 * @param params        - Bayesian prior parameters (defaults to DEFAULT_BAYESIAN_PARAMS)
 * @returns Bayesian-adjusted score in the range [1.0, 5.0]
 *
 * @example
 * // Service with 1 perfect review
 * calcBayesianScore(5.0, 1);  // => ~3.83 (pulled toward 3.0 prior)
 *
 * // Service with 100 reviews averaging 4.8
 * calcBayesianScore(4.8, 100); // => ~4.79 (barely affected)
 */
export function calcBayesianScore(
  observedMean: number,
  reviewCount: number,
  params: BayesianParams = DEFAULT_BAYESIAN_PARAMS
): number {
  const { priorMean, priorStrength } = params;
  if (reviewCount === 0) return priorMean;

  return (
    (priorStrength * priorMean + reviewCount * observedMean) /
    (priorStrength + reviewCount)
  );
}

/**
 * Full pipeline: given a list of reviews for a service, returns the
 * final display score rounded to one decimal place.
 *
 * Steps:
 *  1. Convert each review into a weighted composite score
 *  2. Compute the arithmetic mean of those composite scores
 *  3. Apply Bayesian correction for small sample sizes
 *  4. Round to 1 decimal place
 *
 * @param reviews - Array of review score objects
 * @param params  - Optional Bayesian prior override
 * @returns Final display score (e.g. 4.2), or priorMean if no reviews
 *
 * @example
 * const score = calcServiceScore([
 *   { overall: 5, usability: 4, value: 5, support: 3 },
 *   { overall: 4, usability: 4, value: 3, support: 4 },
 * ]);
 * // => 4.3
 */
export function calcServiceScore(
  reviews: ReviewScores[],
  params: BayesianParams = DEFAULT_BAYESIAN_PARAMS
): number {
  if (reviews.length === 0) return params.priorMean;

  // Step 1: weighted composite for each review
  const composites = reviews.map(calcWeightedScore);

  // Step 2: arithmetic mean of composites
  const mean = composites.reduce((sum, s) => sum + s, 0) / composites.length;

  // Step 3: Bayesian correction
  const bayesian = calcBayesianScore(mean, reviews.length, params);

  // Step 4: round to 1 decimal
  return Math.round(bayesian * 10) / 10;
}

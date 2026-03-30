import { prisma } from "@/lib/prisma";
import { calcServiceScore, type ReviewScores } from "@/lib/score";

/**
 * Recalculates and persists the aggregate score for a given service.
 *
 * This function is called after every new review submission to keep
 * Service.score and Service.reviewCount in sync with actual review data.
 *
 * Steps:
 *  1. Fetch all reviews for the service
 *  2. Re-calculate the Bayesian composite score via calcServiceScore()
 *  3. Update Service.score and Service.reviewCount in the database
 *
 * @param serviceId - The ID of the service to recalculate
 */
export async function updateServiceScore(serviceId: string): Promise<void> {
  // Step 1: Fetch all reviews for this service
  const reviews = await prisma.review.findMany({
    where: { serviceId },
    select: {
      overall: true,
      usability: true,
      value: true,
      support: true,
    },
  });

  // Map Prisma results to ReviewScores shape expected by calcServiceScore
  const reviewScores: ReviewScores[] = reviews.map((r) => ({
    overall: r.overall,
    usability: r.usability,
    value: r.value,
    support: r.support,
  }));

  // Step 2: Calculate new score using the core scoring pipeline
  const newScore = calcServiceScore(reviewScores);

  // Step 3: Persist the updated score and review count
  await prisma.service.update({
    where: { id: serviceId },
    data: {
      score: newScore,
      reviewCount: reviews.length,
    },
  });
}

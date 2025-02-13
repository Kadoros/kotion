interface SM2Item {
  repetition?: number;
  interval?: number;
  ease?: number;
}

export class SM2 {
  /**
   * Calculates new E-Factor based on the original SM-2 formula
   * @param oldEF - Previous E-Factor value
   * @param grade - Response quality (0-5)
   * @returns New E-Factor value (minimum 1.3)
   */
  static calculateNewEFactor(oldEF: number, grade: number): number {
    const newEF = oldEF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    return Math.max(1.3, newEF);
  }

  /**
   * Calculates next interval based on SM-2 algorithm
   * @param repetition - Number of successful repetitions
   * @param oldEF - E-Factor value
   * @param prevInterval - Previous interval
   * @returns Next interval in days
   */
  static calculateNextInterval(
    repetition: number,
    oldEF: number,
    prevInterval: number
  ): number {
    if (repetition === 0) return 1; // I(1) = 1 day
    if (repetition === 1) return 6; // I(2) = 6 days
    return Math.round(prevInterval * oldEF); // I(n) = I(n-1) * EF
  }

  /**
   * Process an item according to SM-2 algorithm
   * @param item - Current item state
   * @param grade - Response quality (0-5)
   * @returns Updated item parameters
   */
  static processItem(item: SM2Item, grade: number) {
    const oldEF = item.ease || 2.5; // Initial E-Factor is 2.5
    const repetition = item.repetition || 0;
    const prevInterval = item.interval || 0;

    // If grade is less than 3, reset repetitions
    if (grade < 3) {
      return {
        ease: this.calculateNewEFactor(oldEF, grade),
        interval: 1,
        repetition: 0,
      };
    }

    // Calculate new values
    const newEF = this.calculateNewEFactor(oldEF, grade);
    const nextInterval = this.calculateNextInterval(
      repetition,
      newEF,
      prevInterval
    );

    return {
      ease: newEF,
      interval: nextInterval,
      repetition: repetition + 1,
    };
  }
}

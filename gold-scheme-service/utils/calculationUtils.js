
// gold-scheme-service/utils/calculationUtils.js
/**
 * Calculate maturity amount based on investment amount, interest rate, and duration
 * @param {Number} amount - Investment amount
 * @param {Number} interestRate - Annual interest rate (in percentage)
 * @param {Number} durationYears - Duration in years
 * @returns {Number} - Maturity amount
 */
exports.calculateMaturityAmount = (amount, interestRate, durationYears) => {
    // Simple interest calculation
    const interest = (amount * interestRate * durationYears) / 100;
    return amount + interest;
  };
  
  /**
   * Convert amount to gold weight based on current gold price
   * @param {Number} amount - Amount in currency
   * @param {Number} goldPricePerGram - Current gold price per gram
   * @returns {Number} - Gold weight in grams
   */
  exports.convertAmountToGoldWeight = (amount, goldPricePerGram) => {
    return amount / goldPricePerGram;
  };
  
  /**
   * Convert gold weight to amount based on current gold price
   * @param {Number} goldWeightInGrams - Gold weight in grams
   * @param {Number} goldPricePerGram - Current gold price per gram
   * @returns {Number} - Amount in currency
   */
  exports.convertGoldWeightToAmount = (goldWeightInGrams, goldPricePerGram) => {
    return goldWeightInGrams * goldPricePerGram;
  };
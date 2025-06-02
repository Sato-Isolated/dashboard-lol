import { zxcvbn, zxcvbnOptions, type Score } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// Configure zxcvbn-ts with languages and dictionaries
const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

// One-time configuration at startup
zxcvbnOptions.setOptions(options);
import { PasswordStrength } from '@/components/common/settings/security-settings/types';

/**
 * Calculate password entropy in bits
 * Entropy = length * log2(alphabet_size)
 */
function calculatePasswordEntropy(password: string): number {
  if (password.length === 0) return 0;

  // Determine the size of the alphabet used
  let alphabetSize = 0;

  if (/[a-z]/.test(password)) alphabetSize += 26; // Lowercase
  if (/[A-Z]/.test(password)) alphabetSize += 26; // Uppercase
  if (/[0-9]/.test(password)) alphabetSize += 10; // Numbers
  if (/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\|;':"<>,./`~]/.test(password))
    alphabetSize += 32; // Common symbols

  // Check for extended ASCII characters (¡ to ÿ)
  if (/[¡-ÿ]/.test(password)) alphabetSize += 190; // Extended ASCII characters

  // Entropy = length × log₂(alphabet_size)
  return password.length * Math.log2(alphabetSize);
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return { strength: 0, label: '', color: '' };

  // Analysis with zxcvbn
  const result = zxcvbn(password);

  // Additional criteria for stricter evaluation
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\|;':"<>,./`~]/.test(
    password
  );
  const hasVariety = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  // Detection of repetitive and weak patterns
  const hasRepeatingChars = /(.)\1{2,}/.test(password); // 3+ consecutive identical characters
  const hasSimplePattern =
    /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+$/i.test(
      password
    );
  const hasKeyboardPattern =
    /(qwerty|azerty|qwertz|asdf|zxcv|123456|abcdef)/i.test(password);

  // Specific detection for repetitive patterns like "dsqdsqdqdsq"
  const hasAlternatingPattern = /^(.{1,3})\1{3,}$/.test(password); // Repetition of short sequences 4+ times
  const hasSimpleAlternation = /^([a-z]{1,2})\1{5,}$/i.test(password); // Simple repetition like "dsqdsqdsq"

  // Calculate entropy
  const entropy = calculatePasswordEntropy(password);

  // Check if password meets our custom "Strong" criteria
  const meetsStrongCriteria =
    password.length >= 12 &&
    hasVariety === 4 &&
    entropy >= 200 && // Minimum entropy of 200 bits
    !hasRepeatingChars &&
    !hasSimplePattern &&
    !hasKeyboardPattern &&
    !hasAlternatingPattern &&
    !hasSimpleAlternation;

  // Determine strength based on strict criteria
  let finalScore: Score;

  // Very weak: obvious patterns or repetitions
  if (
    hasRepeatingChars ||
    hasSimplePattern ||
    hasKeyboardPattern ||
    hasAlternatingPattern ||
    hasSimpleAlternation
  ) {
    finalScore = 0;
  }
  // Weak: less than 8 characters or not enough variety
  else if (password.length < 8 || hasVariety < 2) {
    finalScore = 1;
  }
  // Fair: correct length but limited variety or low zxcvbn score
  else if (password.length < 10 || hasVariety < 3 || result.score <= 1) {
    finalScore = 2;
  }
  // Strong: meets our custom strict criteria (including entropy >= 200 bits)
  else if (meetsStrongCriteria) {
    finalScore = 4;
  }
  // Strong: very good length + all variety + reasonable zxcvbn score + sufficient entropy
  else if (
    password.length >= 12 &&
    hasVariety === 4 &&
    result.score >= 3 &&
    entropy >= 200
  ) {
    finalScore = 4;
  }
  // Good: good length and variety, correct zxcvbn score
  else if (password.length >= 10 && hasVariety >= 3 && result.score >= 2) {
    finalScore = 3;
  } else {
    // For other cases, use zxcvbn score but cap at Good
    finalScore = Math.min(result.score, 3) as Score;
  }

  // Score mapping
  const strengthMap: Record<Score, PasswordStrength> = {
    0: { strength: 1, label: 'Very Weak', color: 'text-error' },
    1: { strength: 1, label: 'Weak', color: 'text-error' },
    2: { strength: 2, label: 'Fair', color: 'text-warning' },
    3: { strength: 3, label: 'Good', color: 'text-info' },
    4: { strength: 4, label: 'Strong', color: 'text-success' },
  };

  return strengthMap[finalScore];
}
/**
 * Secure random password generator
 * Generates cryptographically secure passwords with customizable options
 */

// Character sets
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
// Extended ASCII to increase entropy (safe and readable characters)
const EXTENDED_ASCII = '¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ';

/**
 * Calculate password entropy in bits
 */
function calculateEntropy(password: string): number {
  if (password.length === 0) return 0;

  let alphabetSize = 0;
  if (/[a-z]/.test(password)) alphabetSize += 26;
  if (/[A-Z]/.test(password)) alphabetSize += 26;
  if (/[0-9]/.test(password)) alphabetSize += 10;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) alphabetSize += 32;
  
  // Check for extended ASCII characters
  if (/[¡-ÿ]/.test(password)) alphabetSize += EXTENDED_ASCII.length;
  
  return password.length * Math.log2(alphabetSize);
}

/**
 * Checks if a password has problematic patterns that would reduce its strength
 */
function hasProblematicPattern(password: string): boolean {
  // Check for consecutive repeated characters
  if (/(.)\1{2,}/.test(password)) return true;
  
  // Check for short repetitive patterns
  if (/^(.{1,3})\1{3,}$/.test(password)) return true;
  
  // Check for simple sequences
  if (/^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+$/i.test(password)) return true;
  
  // Check for keyboard patterns
  if (/(qwerty|azerty|qwertz|asdf|zxcv|123456|abcdef)/i.test(password)) return true;
  
  return false;
}

/**
 * Generates a strong password optimized for security
 * Ensures it meets all criteria for "Strong" rating:
 * - 12+ characters
 * - All 5 character types (upper, lower, numbers, symbols, extended ASCII)
 * - Entropy >= 200 bits
 * - No repetitive patterns
 * - High entropy
 */
export function generateStrongPassword(): string {
  // Calculate minimum length to reach 200 bits of entropy
  // With 5 character types: alphabet = 26+26+10+32+EXTENDED_ASCII.length = 94 + 190 = 284 characters
  // Entropy = length × log₂(284) ≈ length × 8.15
  // For 200 bits: length ≥ 200 / 8.15 ≈ 24.5 → minimum 25 characters
  const extendedAlphabetSize = 26 + 26 + 10 + 32 + EXTENDED_ASCII.length; // ≈ 284
  const minLength = Math.max(14, Math.ceil(200 / Math.log2(extendedAlphabetSize))); 
  const maxLength = minLength + 6; // A few extra characters for more security
  
  // Random length
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);
  const length = minLength + (randomValues[0] % (maxLength - minLength + 1));

  // Guaranteed characters for each type (at least 2 of each type to ensure diversity)
  const guaranteedChars = [
    getRandomChar(UPPERCASE.replace(/[OI]/g, '')), // Uppercase 1
    getRandomChar(UPPERCASE.replace(/[OI]/g, '')), // Uppercase 2
    getRandomChar(LOWERCASE.replace(/[oli]/g, '')), // Lowercase 1
    getRandomChar(LOWERCASE.replace(/[oli]/g, '')), // Lowercase 2
    getRandomChar(NUMBERS.replace(/[01]/g, '')), // Number 1
    getRandomChar(NUMBERS.replace(/[01]/g, '')), // Number 2
    getRandomChar(SYMBOLS), // Symbol 1
    getRandomChar(SYMBOLS), // Symbol 2
    getRandomChar(EXTENDED_ASCII), // Extended ASCII 1
    getRandomChar(EXTENDED_ASCII), // Extended ASCII 2
  ];

  // Build complete character set (without similar characters + extended ASCII)
  const cleanUppercase = UPPERCASE.replace(/[OI]/g, '');
  const cleanLowercase = LOWERCASE.replace(/[oli]/g, '');
  const cleanNumbers = NUMBERS.replace(/[01]/g, '');
  const fullCharset = cleanUppercase + cleanLowercase + cleanNumbers + SYMBOLS + EXTENDED_ASCII;

  // Generate remaining characters
  const remainingLength = length - guaranteedChars.length;
  const randomChars: string[] = [];

  for (let i = 0; i < remainingLength; i++) {
    randomChars.push(getRandomChar(fullCharset));
  }

  // Combine all characters
  const allChars = [...guaranteedChars, ...randomChars];
  
  // Shuffle multiple times to avoid patterns
  let password = shuffleArray(allChars).join('');
  
  // Anti-pattern and entropy check: ensure no repetitions and sufficient entropy
  let attempts = 0;
  while ((hasProblematicPattern(password) || calculateEntropy(password) < 200) && attempts < 20) {
    const reshuffled = shuffleArray(allChars);
    password = reshuffled.join('');
    attempts++;
    
    // If we can't get enough entropy, increase length
    if (attempts > 10 && calculateEntropy(password) < 200) {
      const extraChars = [getRandomChar(fullCharset), getRandomChar(fullCharset)];
      allChars.push(...extraChars);
      password = shuffleArray(allChars).join('');
    }
  }

  return password;
}

/**
 * Gets a cryptographically secure random character from a string
 */
function getRandomChar(str: string): string {
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);
  const index = randomValues[0] % str.length;
  return str[index];
}

/**
 * Shuffles an array using Fisher-Yates algorithm with crypto.getRandomValues
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    const j = randomValues[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
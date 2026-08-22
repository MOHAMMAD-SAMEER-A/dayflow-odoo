/**
 * Normalizes a string to be uppercase, stripping out diacritics/accents
 * and keeping only alphabetic characters.
 * E.g., "André" -> "ANDRE", "O'Connor" -> "OCONNOR"
 */
export function normalizeNameString(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD') // Decompose combined graphemes (separates accents from letters)
    .replace(/[\u0300-\u036f]/g, '') // Strip diacritic marks
    .replace(/[^a-zA-Z]/g, '') // Keep only letters
    .toUpperCase();
}

/**
 * Gets a 2-letter prefix for the company name.
 * For multi-word names, it takes the first character of the first two words (e.g., "Odoo India" -> "OI").
 * For backward compatibility, "Odoo Project" maps to "OD".
 * Otherwise, it takes the first two characters of the company name.
 */
export function getCompanyPrefix(companyName: string): string {
  if (!companyName) return 'XX';
  const trimmed = companyName.trim();
  
  // Backward compatibility with mock database record prefix
  if (trimmed.toLowerCase() === 'odoo project') {
    return 'OD';
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const char1 = normalizeNameString(words[0]).charAt(0);
    const char2 = normalizeNameString(words[1]).charAt(0);
    const prefix = `${char1}${char2}`;
    if (prefix.length === 2 && /^[A-Z]{2}$/.test(prefix)) {
      return prefix;
    }
  }

  const normalized = normalizeNameString(trimmed);
  return normalized.slice(0, 2).padEnd(2, 'X');
}

interface GenerateEmployeeIdParams {
  companyName: string;
  firstName: string;
  lastName: string;
  dateOfJoining: Date | string | number;
  sequentialCount: number; // 1-indexed count
}

/**
 * Generates an employee ID with the format:
 * [Company Prefix (2 chars)] + [First 2 letters of first name + First 2 letters of last name] + [Year of joining YYYY] + [4-digit sequential count]
 *
 * Example:
 * Company: "Odoo India" -> "OI"
 * Name: "John Doe" -> "JODO"
 * Year: 2022
 * Count: 1 -> "0001"
 * Result: "OIJODO20220001"
 */
export function generateEmployeeId({
  companyName,
  firstName,
  lastName,
  dateOfJoining,
  sequentialCount,
}: GenerateEmployeeIdParams): string {
  // 1. Company Prefix: 2 uppercase letters.
  const companyPrefix = getCompanyPrefix(companyName);

  // 2. Name Initials: 2 letters from first name, 2 letters from last name.
  // If a name is too short (e.g., "Al"), it pads with "X".
  const cleanFirst = normalizeNameString(firstName);
  const cleanLast = normalizeNameString(lastName);
  
  const firstPart = cleanFirst.slice(0, 2).padEnd(2, 'X');
  const lastPart = cleanLast.slice(0, 2).padEnd(2, 'X');
  const initials = `${firstPart}${lastPart}`;

  // 3. Year of Joining: 4 digits.
  let year = new Date().getFullYear();
  if (dateOfJoining instanceof Date) {
    year = dateOfJoining.getFullYear();
  } else if (typeof dateOfJoining === 'string') {
    const parsedDate = new Date(dateOfJoining);
    if (!isNaN(parsedDate.getTime())) {
      year = parsedDate.getFullYear();
    }
  } else if (typeof dateOfJoining === 'number') {
    year = dateOfJoining;
  }

  const yearStr = String(year).slice(-4).padStart(4, '0');

  // 4. Sequential Count: 4-digit zero-padded sequential string.
  const safeCount = Math.max(1, Math.floor(sequentialCount));
  const countStr = String(safeCount).padStart(4, '0');

  return `${companyPrefix}${initials}${yearStr}${countStr}`;
}

/**
 * Validates whether an employee ID conforms to the Dayflow HRMS format constraints.
 */
export function isValidEmployeeId(employeeId: string): boolean {
  if (!employeeId || employeeId.length < 12) return false;
  // Regex format: 
  // 2 chars (Company) + 4 chars (Initials) + 4 digits (Year) + at least 4 digits (Sequence)
  const regex = /^[A-Z]{6}\d{4}\d{4,}$/;
  return regex.test(employeeId);
}

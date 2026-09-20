/**
 * Validation utilities for KYC compliance for TheRide-Driver
 */

export function validatePAN(pan: string): { isValid: boolean; message: string } {
  const trimmed = pan.trim().toUpperCase();
  if (!trimmed) {
    return { isValid: false, message: 'PAN number is mandatory' };
  }
  // Standard Indian PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(trimmed)) {
    return { isValid: false, message: 'Invalid PAN format. Example: ABCDE1234F' };
  }
  return { isValid: true, message: 'Valid PAN card number' };
}

export function validateAadhaar(aadhaar: string): { isValid: boolean; message: string } {
  const clean = aadhaar.replace(/\s+/g, '');
  if (!clean) {
    return { isValid: false, message: 'Aadhaar number is mandatory' };
  }
  if (!/^\d{12}$/.test(clean)) {
    return { isValid: false, message: 'Aadhaar must be exactly 12 digits' };
  }
  // Verhoeff or basic sanity check: not all same digit
  if (/^(\d)\1{11}$/.test(clean)) {
    return { isValid: false, message: 'Invalid Aadhaar number sequence' };
  }
  return { isValid: true, message: 'Valid 12-digit Aadhaar' };
}

export function formatAadhaar(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 12);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.substring(i, i + 4));
  }
  return parts.join(' ');
}

export function validateDrivingLicense(dl: string): { isValid: boolean; message: string } {
  const trimmed = dl.trim().toUpperCase();
  if (!trimmed) {
    return { isValid: false, message: 'Driving License number is mandatory' };
  }
  // Standard Indian DL: 15-16 alphanumeric chars (State code 2 letters + 2 digit RTO code + 11 digits)
  // Also relaxed to accommodate older or dash-separated formats
  const clean = trimmed.replace(/[\s-]/g, '');
  if (clean.length < 10 || clean.length > 18) {
    return { isValid: false, message: 'DL number must be between 10 to 18 characters' };
  }
  const dlPattern = /^[A-Z]{2}[0-9]{2}[0-9A-Z]{7,14}$/;
  if (!dlPattern.test(clean)) {
    return { isValid: false, message: 'Format: State code followed by RTO and license numbers (e.g. DL1420110012345)' };
  }
  return { isValid: true, message: 'Valid Driving License number' };
}

export function validateVehiclePlate(plate: string): { isValid: boolean; message: string } {
  const clean = plate.trim().toUpperCase().replace(/[\s-]/g, '');
  if (!clean) {
    return { isValid: false, message: 'Vehicle registration plate is mandatory' };
  }
  // e.g. DL01AB1234 or MH02CZ9999 or BH22A1234AA
  const plateRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$|^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/;
  if (clean.length < 6 || clean.length > 12) {
    return { isValid: false, message: 'Invalid registration number length' };
  }
  if (!plateRegex.test(clean)) {
    return { isValid: false, message: 'Format example: DL 01 AB 1234 or MH 02 CD 5678' };
  }
  return { isValid: true, message: 'Valid vehicle registration number' };
}

export function validatePhone(phone: string): { isValid: boolean; message: string } {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return { isValid: true, message: 'Valid mobile number' };
  }
  return { isValid: false, message: 'Enter a valid 10-digit Indian mobile number' };
}

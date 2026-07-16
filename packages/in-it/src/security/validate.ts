/**
 * @module security/validate
 * Form validation utility for client-side UX.
 *
 * **Important**: Client-side validation is for user experience only,
 * NOT a security measure. Always validate on the server.
 *
 * Works with in-it's `Input` and `Textarea` components via the
 * existing `error` prop — no new component API needed.
 *
 * @example
 * ```tsx
 * import { createFormValidator } from "@kotsumo/in-it/security";
 *
 * const validator = createFormValidator({
 *   email: { required: true, pattern: /^[^@]+@[^@]+$/, message: "Invalid email" },
 *   amount: { required: true, min: 0, message: "Must be >= 0" },
 * });
 *
 * const errors = validator.validate({ email: "", amount: -1 });
 * // errors = { email: "Required", amount: "Must be >= 0" }
 *
 * <Input label="Email" error={errors?.email} />
 * ```
 */

/** Validation rule for a single field. */
export interface ValidationRule {
  /** Field is required (non-empty string, not null/undefined). */
  required?: boolean;
  /** Regex pattern the value must match. */
  pattern?: RegExp;
  /** Minimum value (for numbers) or minimum length (for strings). */
  min?: number;
  /** Maximum value (for numbers) or maximum length (for strings). */
  max?: number;
  /** Minimum string length. */
  minLength?: number;
  /** Maximum string length. */
  maxLength?: number;
  /** Custom validation function. Return error message or undefined. */
  custom?: (value: unknown) => string | undefined;
  /** Error message when validation fails (used for required/pattern/min/max). */
  message?: string;
  /** Error message specifically for the required check. */
  requiredMessage?: string;
}

/** Map of field names to validation rules. */
export type ValidationRules = Record<string, ValidationRule>;

/** Map of field names to error messages (or undefined if valid). */
export type ValidationErrors<T extends ValidationRules> = {
  [K in keyof T]?: string;
};

/** Form validator instance. */
export interface FormValidator<T extends ValidationRules> {
  /**
   * Validate form data against rules.
   * Returns error map if any field fails, or null if all pass.
   */
  validate: (data: Record<string, unknown>) => ValidationErrors<T> | null;

  /**
   * Validate a single field.
   * Returns error message or undefined.
   */
  validateField: (field: keyof T & string, value: unknown) => string | undefined;
}

/**
 * Validate a single value against a rule.
 * Returns error message or undefined.
 */
function validateValue(value: unknown, rule: ValidationRule): string | undefined {
  // Required check
  if (rule.required) {
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
      return rule.requiredMessage ?? rule.message ?? "Required";
    }
  }

  // Skip remaining checks if value is empty and not required
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  // Pattern check (strings only)
  if (rule.pattern && typeof value === "string") {
    if (!rule.pattern.test(value)) {
      return rule.message ?? "Invalid format";
    }
  }

  // String length checks
  if (typeof value === "string") {
    if (rule.minLength !== undefined && value.length < rule.minLength) {
      return rule.message ?? `Must be at least ${rule.minLength} characters`;
    }
    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
      return rule.message ?? `Must be at most ${rule.maxLength} characters`;
    }
  }

  // Numeric checks (min/max for numbers, length for strings)
  if (typeof value === "number") {
    if (rule.min !== undefined && value < rule.min) {
      return rule.message ?? `Must be at least ${rule.min}`;
    }
    if (rule.max !== undefined && value > rule.max) {
      return rule.message ?? `Must be at most ${rule.max}`;
    }
  } else if (typeof value === "string" && rule.min !== undefined && rule.max === undefined && rule.minLength === undefined) {
    // For strings, min/max can also mean length if minLength/maxLength not set
    const num = Number(value);
    if (!Number.isNaN(num)) {
      if (rule.min !== undefined && num < rule.min) {
        return rule.message ?? `Must be at least ${rule.min}`;
      }
      if (rule.max !== undefined && num > rule.max) {
        return rule.message ?? `Must be at most ${rule.max}`;
      }
    }
  }

  // Custom validation
  if (rule.custom) {
    return rule.custom(value);
  }

  return undefined;
}

/**
 * Create a form validator from a set of rules.
 *
 * The returned validator does NOT modify components —
 * pass its results to the existing `error` prop on Input/Textarea.
 *
 * **⚠️ Client-side validation is for UX only, not security.**
 * **Always validate on the server.**
 *
 * @example
 * ```tsx
 * const validator = createFormValidator({
 *   name: { required: true, requiredMessage: "名前を入力してください" },
 *   email: { required: true, pattern: /^[^@]+@[^@]+$/, message: "メールアドレスが無効です" },
 *   amount: { required: true, min: 0, message: "金額は0以上です" },
 * });
 *
 * // Validate all fields
 * const errors = validator.validate({ name: "", email: "bad", amount: -1 });
 * // => { name: "名前を入力してください", email: "メールアドレスが無効です", amount: "金額は0以上です" }
 *
 * // Validate single field (for real-time feedback)
 * const emailError = validator.validateField("email", userInput);
 *
 * // Use with in-it components
 * <Input label="メール" error={errors?.email} />
 * <NumberInput label="金額" prefix="¥" error={errors?.amount} />
 * ```
 */
export function createFormValidator<T extends ValidationRules>(rules: T): FormValidator<T> {
  return {
    validate(data: Record<string, unknown>): ValidationErrors<T> | null {
      const errors: Record<string, string> = {};
      let hasErrors = false;

      for (const [field, rule] of Object.entries(rules)) {
        const error = validateValue(data[field], rule);
        if (error) {
          errors[field] = error;
          hasErrors = true;
        }
      }

      return hasErrors ? (errors as ValidationErrors<T>) : null;
    },

    validateField(field: keyof T & string, value: unknown): string | undefined {
      const rule = rules[field];
      if (!rule) return undefined;
      return validateValue(value, rule);
    },
  };
}

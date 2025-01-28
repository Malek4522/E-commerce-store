export interface RangeWithStep {
    min: number;
    max: number;
    step: number;
}

/**
 * Rounds step size to a nice number like 0.5, 1, 2, 5, 10, and aligns range
 * bounds to this step. May expand the range, but never shrinks it.
 * @example
 * Input:  { min: 6.3, max: 28.1, step: 3.8 }
 * Output: { min: 5,   max: 30,   step: 5   }
 */
export const alignRangeToNiceStep = ({ min, max, step }: RangeWithStep): RangeWithStep => {
    if (step <= 0) throw new RangeError(`Invalid step size: ${step}`);
    if (min > max) throw new RangeError(`Invalid range: ${min}, ${max}`);

    const { mantissa, exponent } = roundStepToNiceNumber(step);

    step = mantissa * 10 ** exponent;
    min = roundDownToStep(min, step);
    max = roundUpToStep(max, step);

    // Adjust for precision errors in binary representation of decimal fractions.
    // During step calculation: 10 ** -4 = 0.00009999999999999999
    // During bound rounding: 12 * 0.1 = 1.2000000000000002
    if (exponent < 0) {
        step = roundDecimal(step, -exponent);
        min = roundDecimal(min, -exponent);
        max = roundDecimal(max, -exponent);
    }

    return { min, max, step };
};

/**
 * Rounds a step size to a nice number based on divisors of ten (1, 2, 5):
 * - 1×10ⁿ: ..., 0.1, 1, 10, ...
 * - 2×10ⁿ: ..., 0.2, 2, 20, ...
 * - 5×10ⁿ: ..., 0.5, 5, 50, ...
 */
const roundStepToNiceNumber = (step: number) => {
    const exponent = Math.floor(Math.log10(step));
    const mantissa = step / 10 ** exponent;
    if (mantissa < 1.5) return { mantissa: 1, exponent };
    if (mantissa < 3.5) return { mantissa: 2, exponent };
    if (mantissa < 7.5) return { mantissa: 5, exponent };
    return { mantissa: 1, exponent: exponent + 1 };
};

/** Rounds a number down to the nearest multiple of `step`. */
const roundDownToStep = (x: number, step: number): number => {
    return Math.floor(x / step) * step;
};

/** Rounds a number up to the nearest multiple of `step`. */
const roundUpToStep = (x: number, step: number): number => {
    return Math.ceil(x / step) * step;
};

/** Rounds a number to a specified number of decimal places. */
const roundDecimal = (x: number, decimalPlaces: number): number => {
    const scale = 10 ** decimalPlaces;
    return Math.round(x * scale) / scale;
};

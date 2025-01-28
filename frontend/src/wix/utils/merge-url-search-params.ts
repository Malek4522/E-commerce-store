/**
 * Merges multiple URLSearchParams instances into one URLSearchParams.
 *
 * For entries with the same key, values from subsequent URLSearchParams
 * instances will overwrite the earlier ones. For example:
 * ```js
 * const a = new URLSearchParams([['foo', '1'], ['foo', '2']])
 * const b = new URLSearchParams([['foo', '3'], ['foo', '4']])
 * const c = mergeUrlSearchParams(a, b);
 * c.toString(); // 'foo=3&foo=4'
 * ```
 */
export function mergeUrlSearchParams(...paramsArr: URLSearchParams[]): URLSearchParams {
    const result = new URLSearchParams();

    for (const params of paramsArr) {
        const overriddenParams = new Set<string>();

        for (const [key, value] of params.entries()) {
            if (result.has(key) && !overriddenParams.has(key)) {
                result.delete(key);
                overriddenParams.add(key);
            }

            result.append(key, value);
        }
    }

    return result;
}

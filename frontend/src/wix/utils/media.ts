export interface WixImage {
    /** The Wix Media ID for the image, e.g.: "c837a6_15f76c50660f4eb2880397307fc9d114~mv2.jpg" */
    id: string;
    /** The image's original width. */
    width: number;
    /** The image's original height. */
    height: number;
}

export interface WixImageTransformOptions {
    /** Image quality from 1 to 100. Defaults to 80. */
    quality?: number;
    /** Scale the image down to cover at least this width. */
    minWidth?: number;
    /** Scale the image down to cover at least this height. */
    minHeight?: number;
    /** Scale the image down to fit within this width. */
    maxWidth?: number;
    /** Scale the image down to fit within this height. */
    maxHeight?: number;
}

/**
 * Returns a URL for an image stored on the Wix Media Platform, optimized for the
 * specified dimensions and quality.
 * See https://dev.wix.com/docs/sdk/core-modules/sdk/media
 */
export const getWixImageUrl = (image: WixImage, options: WixImageTransformOptions = {}) => {
    const { id, width, height } = image;
    const { minWidth, minHeight, maxWidth, maxHeight, quality = 80 } = options;

    let fitScale = 1;
    if (maxWidth !== undefined) fitScale = Math.min(fitScale, maxWidth / width);
    if (maxHeight !== undefined) fitScale = Math.min(fitScale, maxHeight / height);

    let coverScale = 0;
    if (minWidth !== undefined) coverScale = Math.max(coverScale, minWidth / width);
    if (minHeight !== undefined) coverScale = Math.max(coverScale, minHeight / height);

    // Fit into a square instead of a proportionally scaled rectangle to avoid
    // off-by-one scaling errors from wixstatic.com
    const scale = Math.min(1, coverScale || fitScale);
    const size = Math.round(scale * Math.max(width, height));

    // Not using Wix SDK's `media.getScaledToFitImageUrl()`, as it generates
    // different URLs on the client and server, causing hydration errors, and
    // crops the image instead of fitting it.
    return `https://static.wixstatic.com/media/${id}/v1/fit/w_${size},h_${size},q_${quality}/${id}`;
};

export const getWixImageIdFromUrl = (url: string): string | undefined => {
    if (!url.startsWith('https://static.wixstatic.com/media/')) return;
    return new URL(url).pathname.split('/').at(2);
};

import { CollectionDetails } from '../ecom';
import { getWixImageIdFromUrl, getWixImageUrl, WixImageTransformOptions } from '../utils';

export function getCategoryImageUrl(
    category: CollectionDetails,
    options: WixImageTransformOptions = {},
): string | undefined {
    const image = category.media?.mainMedia?.image;
    if (!image) return;
    const id = getWixImageIdFromUrl(image.url);
    if (!id) return;
    return getWixImageUrl({ id, width: image.width, height: image.height }, options);
}

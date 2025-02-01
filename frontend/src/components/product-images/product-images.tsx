import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ImagePlaceholderIcon } from '../icons';
import styles from './product-images.module.scss';

interface ProductImage {
    id: string;
    url: string;
    altText?: string;
}

interface ProductImagesProps {
    images?: ProductImage[];
    mainImage?: ProductImage;
}

export const ProductImages = ({ images = [], mainImage }: ProductImagesProps) => {
    const [selectedImage, setSelectedImage] = useState<ProductImage | undefined>(mainImage);

    useEffect(() => {
        setSelectedImage(mainImage);
    }, [mainImage]);

    return (
        <div>
            <div className={styles.mainImageWrapper}>
                {selectedImage ? (
                    <img
                        className={styles.mainImage}
                        src={selectedImage.url}
                        alt={selectedImage.altText ?? ''}
                    />
                ) : (
                    <ImagePlaceholderIcon className={styles.imagePlaceholderIcon} />
                )}
            </div>

            {images.length > 0 && (
                <div className={styles.thumbnails}>
                    {images.map((image) => (
                        <button
                            key={image.id}
                            className={classNames(styles.thumbnail, {
                                [styles.selected]: selectedImage && selectedImage.id === image.id,
                            })}
                            onClick={() => setSelectedImage(image)}
                            type="button"
                        >
                            <img
                                className={styles.thumbnailImage}
                                src={image.url}
                                alt={image.altText ?? ''}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

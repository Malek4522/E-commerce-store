import styles from './product-details.module.scss';

export function ProductDetailsSkeleton() {
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                {/* Image skeleton */}
                <div className={styles.imageSkeleton}>
                    <div className={styles.mainImageSkeleton} />
                    <div className={styles.thumbnailsSkeleton}>
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className={styles.thumbnailSkeleton} />
                        ))}
                    </div>
                </div>

                {/* Details skeleton */}
                <div className={styles.detailsSkeleton}>
                    <div className={styles.titleSkeleton} />
                    <div className={styles.priceSkeleton} />
                    <div className={styles.descriptionSkeleton}>
                        <div />
                        <div />
                        <div />
                    </div>
                    <div className={styles.optionsSkeleton}>
                        <div />
                        <div />
                    </div>
                    <div className={styles.buttonSkeleton} />
                </div>
            </div>
        </div>
    );
} 
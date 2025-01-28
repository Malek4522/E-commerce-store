import styles from './empty-products-category.module.scss';

interface EmptyProductsCategoryProps {
    title: string;
    subtitle: string;
    actionButton?: React.ReactNode;
}

export const EmptyProductsCategory = ({
    title,
    subtitle,
    actionButton,
}: EmptyProductsCategoryProps) => {
    return (
        <div className={styles.root}>
            <h1 className={styles.title}>{title}</h1>
            <div className="paragraph2">{subtitle}</div>
            {actionButton}
        </div>
    );
};

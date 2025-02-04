import { ProductSortingSelect } from '../product-sorting-select/product-sorting-select';
import styles from './products-header.module.scss';

interface ProductsHeaderProps {
    title: string;
}

export function ProductsHeader({ title }: ProductsHeaderProps) {
    return (
        <div className={styles.root}>
            <h1 className={styles.title}>{title}</h1>
        </div>
    );
} 
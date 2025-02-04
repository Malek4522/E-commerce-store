import { ProductFiltersComponent } from '../product-filters/product-filters';
import styles from './products-sidebar.module.scss';

export function ProductsSidebar() {
    return (
        <aside className={styles.root}>
            <ProductFiltersComponent />
        </aside>
    );
} 
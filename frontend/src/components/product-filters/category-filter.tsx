import { useCategories } from '~/src/api/hooks';
import { Checkbox } from '~/src/components/checkbox/checkbox';

import styles from './category-filter.module.scss';

interface CategoryFilterProps {
    value?: string[];
    onChange: (categories: string[]) => void;
}

export const CategoryFilter = ({ value = [], onChange }: CategoryFilterProps) => {
    const { data: categories } = useCategories();

    if (!categories?.length) {
        return null;
    }

    const handleChange = (categoryId: string, checked: boolean) => {
        const newCategories = checked
            ? [...value, categoryId]
            : value.filter((id) => id !== categoryId);
        onChange(newCategories);
    };

    return (
        <div className={styles.root}>
            <h3 className={styles.title}>Categories</h3>
            <div className={styles.categories}>
                {categories.map((category) => (
                    <Checkbox
                        key={category.id}
                        label={category.name}
                        checked={value.includes(category.id)}
                        onChange={(checked) => handleChange(category.id, checked)}
                    />
                ))}
            </div>
        </div>
    );
}; 
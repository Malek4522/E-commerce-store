import { useCallback } from 'react';
import { Slider } from '~/src/components/slider/slider';
import { formatPrice, useDebouncedCallback } from '~/src/api/utils';
import styles from './price-filter.module.scss';

interface PriceFilterProps {
    value?: { min: number; max: number };
    onChange: (value: { min: number; max: number }) => void;
}

export const PriceFilter = ({ value, onChange }: PriceFilterProps) => {
    const handleChange = useDebouncedCallback(onChange, 300);

    const formatPriceRange = useCallback((min: number, max: number) => {
        return `${formatPrice(min)} - ${formatPrice(max)}`;
    }, []);

    if (!value) {
        return null;
    }

    return (
        <div className={styles.root}>
            <h3 className={styles.title}>Price Range</h3>
            <div className={styles.slider}>
                <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={[value.min, value.max]}
                    onChange={([min, max]) => handleChange({ min, max })}
                    formatLabel={formatPriceRange}
                />
            </div>
        </div>
    );
};

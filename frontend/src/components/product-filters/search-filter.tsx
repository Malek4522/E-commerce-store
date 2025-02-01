import { Input } from '~/src/components/input/input';
import { SearchIcon } from '~/src/components/icons';
import { useDebouncedCallback } from '~/src/api/utils';

import styles from './search-filter.module.scss';

interface SearchFilterProps {
    value?: string;
    onChange: (value: string) => void;
}

export const SearchFilter = ({ value = '', onChange }: SearchFilterProps) => {
    const handleChange = useDebouncedCallback(onChange, 300);

    return (
        <div className={styles.root}>
            <Input
                type="search"
                placeholder="Search products..."
                defaultValue={value}
                onChange={(e) => handleChange(e.target.value)}
                icon={<SearchIcon />}
            />
        </div>
    );
}; 
import { Form } from '@remix-run/react';
import { type FC, type FormEventHandler, useState } from 'react';
import { CrossSmallIcon, SearchIcon } from '../icons';
import styles from './search-input.module.scss';

export interface SearchInputProps {
    className?: string;
    defaultValue?: string;
    onSearchSubmit?: (value: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({
    className,
    defaultValue = '',
    onSearchSubmit,
}) => {
    const [value, setValue] = useState(defaultValue);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (value.trim()) onSearchSubmit?.(value);
    };

    return (
        <Form className={className} role="search" onSubmit={handleSubmit}>
            <label className={styles.label}>
                <SearchIcon className={styles.searchIcon} />
                <input
                    className={styles.input}
                    type="text"
                    spellCheck="false"
                    placeholder="Search"
                    minLength={2}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
                <CrossSmallIcon className={styles.clearIcon} onClick={() => setValue('')} />
            </label>
        </Form>
    );
};

import classNames from 'classnames';
import { OptionType, Choice } from '~/src/api/types';
import { ColorSelect } from '../color-select/color-select';
import { Select } from '../select/select';
import styles from './product-option.module.scss';

export interface ProductOptionProps {
    name: string;
    optionType: OptionType;
    choices: Choice[];
    selectedValue?: string;
    error?: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ProductOption({
    name,
    optionType,
    choices,
    selectedValue,
    error,
    onChange,
    className,
}: ProductOptionProps) {
    const options = choices.map(choice => ({
        value: choice.value,
        label: choice.description,
        disabled: !choice.inStock || !choice.visible
    }));

    return (
        <div className={classNames(styles.root, className)}>
            <label className={styles.label}>
                {name}
                {error && <span className={styles.error}>{error}</span>}
            </label>
            {optionType === OptionType.color ? (
                <ColorSelect
                    options={options}
                    value={selectedValue || ''}
                    onChange={onChange}
                    hasError={!!error}
                />
            ) : (
                <Select
                    options={options}
                    value={selectedValue || ''}
                    onChange={onChange}
                    placeholder={`Select ${name.toLowerCase()}`}
                    hasError={!!error}
                />
            )}
        </div>
    );
}

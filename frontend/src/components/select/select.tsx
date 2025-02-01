import { forwardRef } from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import classNames from 'classnames';
import { ChevronDownIcon } from '~/src/components/icons';

import styles from './select.module.scss';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    hasError?: boolean;
    className?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
    ({ options, value, onChange, placeholder, hasError, className }, ref) => {
        const selectedOption = options.find(option => option.value === value);

        return (
            <RadixSelect.Root value={value} onValueChange={onChange}>
                <RadixSelect.Trigger
                    ref={ref}
                    className={classNames(styles.trigger, className, { [styles.error]: hasError })}
                >
                    <RadixSelect.Value placeholder={placeholder}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </RadixSelect.Value>
                    <RadixSelect.Icon className={styles.icon}>
                        <ChevronDownIcon />
                    </RadixSelect.Icon>
                </RadixSelect.Trigger>

                <RadixSelect.Portal>
                    <RadixSelect.Content className={styles.content}>
                        <RadixSelect.Viewport className={styles.viewport}>
                            {placeholder && (
                                <RadixSelect.Item
                                    value=""
                                    disabled
                                    className={styles.placeholder}
                                >
                                    <RadixSelect.ItemText>{placeholder}</RadixSelect.ItemText>
                                </RadixSelect.Item>
                            )}
                            {options.map(option => (
                                <RadixSelect.Item
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                    className={styles.item}
                                >
                                    <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                                </RadixSelect.Item>
                            ))}
                        </RadixSelect.Viewport>
                    </RadixSelect.Content>
                </RadixSelect.Portal>
            </RadixSelect.Root>
        );
    }
);

export interface SelectItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const SelectItem = ({ value, children, className }: SelectItemProps) => {
    return (
        <RadixSelect.Item className={classNames(styles.item, className)} value={value}>
            <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        </RadixSelect.Item>
    );
};

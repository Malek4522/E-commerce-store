import { useState } from 'react';
import { CartItemOption } from '~/src/api/types';
import classNames from 'classnames';
import { DropdownIcon } from '~/src/components/icons';

import styles from './cart-item-options.module.scss';

interface CartItemOptionsProps {
    options: CartItemOption[];
    /**
     * The maximum amount of options that are visible even in the collapsed state.
     */
    visibleOptionsCount: number;
    className?: string;
}

export const CartItemOptions = ({
    options,
    visibleOptionsCount,
    className,
}: CartItemOptionsProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleIsExpanded = () => setIsExpanded((prev) => !prev);

    return (
        <div className={classNames(styles.root, { [styles.expanded]: isExpanded }, className)}>
            {options.slice(0, isExpanded ? undefined : visibleOptionsCount).map((option) => (
                <div key={option.name} className="paragraph3">
                    {option.name}: {option.value}
                </div>
            ))}

            {options.length > visibleOptionsCount && (
                <button
                    className={classNames(styles.moreOptionsButton, 'linkButton')}
                    onClick={toggleIsExpanded}
                >
                    {isExpanded ? 'Less Details' : 'More Details'}
                    <DropdownIcon className={styles.moreOptionsIcon} />
                </button>
            )}
        </div>
    );
};

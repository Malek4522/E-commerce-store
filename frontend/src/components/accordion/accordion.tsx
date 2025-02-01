import classNames from 'classnames';
import { useState } from 'react';
import styles from './accordion.module.scss';

export interface AccordionItem {
    header: React.ReactNode;
    content: React.ReactNode;
}

export interface AccordionProps {
    items: AccordionItem[];
    initialOpenItemIndex?: number;
    expandIcon?: React.ReactNode;
    collapseIcon?: React.ReactNode;
    className?: string;
}

export function Accordion({
    items,
    initialOpenItemIndex,
    expandIcon,
    collapseIcon,
    className,
}: AccordionProps) {
    const [openItemIndex, setOpenItemIndex] = useState(initialOpenItemIndex);

    return (
        <div className={classNames(styles.root, className)}>
            {items.map((item, index) => {
                const isOpen = openItemIndex === index;

                return (
                    <div
                        key={index}
                        className={classNames(styles.item, {
                            [styles.open]: isOpen,
                        })}
                    >
                        <button
                            type="button"
                            className={styles.header}
                            onClick={() => setOpenItemIndex(isOpen ? undefined : index)}
                            aria-expanded={isOpen}
                        >
                            {item.header}
                            <span className={styles.icon}>
                                {isOpen ? collapseIcon : expandIcon}
                            </span>
                        </button>
                        {isOpen && <div className={styles.content}>{item.content}</div>}
                    </div>
                );
            })}
        </div>
    );
}

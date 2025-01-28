import { useState } from 'react';
import classNames from 'classnames';
import { getClickableElementAttributes } from '~/src/wix/utils';
import { DropdownIcon } from '../icons';

import styles from './accordion.module.scss';

interface AccordionItem {
    header: React.ReactNode;
    content: React.ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    initialOpenItemIndex?: number;
    className?: string;
    small?: boolean;
    expandIcon?: React.ReactNode;
    collapseIcon?: React.ReactNode;
}

export const Accordion = ({
    items,
    initialOpenItemIndex,
    className,
    small = false,
    expandIcon,
    collapseIcon,
}: AccordionProps) => {
    const [openItemIndex, setOpenItemIndex] = useState<number | null>(initialOpenItemIndex ?? null);

    return (
        <div className={classNames({ [styles.small]: small }, className)}>
            {items.map((item, index) => {
                const isOpen = openItemIndex === index;

                return (
                    <div key={index} className={styles.item}>
                        <div
                            className={styles.header}
                            {...getClickableElementAttributes(() =>
                                setOpenItemIndex(isOpen ? null : index),
                            )}
                        >
                            <div className={styles.headerContent}>{item.header}</div>

                            <div className={styles.toggleIconContainer}>
                                {isOpen
                                    ? collapseIcon || (
                                          <DropdownIcon
                                              width={12}
                                              className={styles.collapseIcon}
                                          />
                                      )
                                    : expandIcon || <DropdownIcon width={12} />}
                            </div>
                        </div>

                        <div
                            className={classNames(styles.content, {
                                [styles.expanded]: isOpen,
                            })}
                        >
                            <div className={styles.contentExpander}>
                                <div className={styles.contentInner}>{item.content}</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

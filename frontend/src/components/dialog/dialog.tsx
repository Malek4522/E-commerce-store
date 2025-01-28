import classNames from 'classnames';
import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { CrossIcon } from '../icons';

import styles from './dialog.module.scss';

export interface DialogProps extends React.PropsWithChildren {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    showCloseButton?: boolean;
    trigger?: React.ReactElement;
    contentProps?: RadixDialog.DialogContentProps;
}

export const Dialog = ({
    trigger,
    open,
    showCloseButton = true,
    onOpenChange,
    children,
    contentProps = {},
}: DialogProps) => (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
        {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
        <RadixDialog.Portal>
            <RadixDialog.Overlay className={styles.overlay} />
            <RadixDialog.Content
                {...contentProps}
                className={classNames(styles.content, contentProps.className)}
            >
                {children}
                {showCloseButton && (
                    <RadixDialog.Close asChild>
                        <button
                            className={classNames('iconButton', styles.closeButton)}
                            aria-label="Close dialog"
                        >
                            <CrossIcon width={24} height={24} />
                        </button>
                    </RadixDialog.Close>
                )}
            </RadixDialog.Content>
        </RadixDialog.Portal>
    </RadixDialog.Root>
);

export type DialogTitleProps = RadixDialog.DialogTitleProps;

export const DialogTitle = React.forwardRef<HTMLDivElement, DialogTitleProps>(
    ({ className, ...restProps }: DialogTitleProps, ref) => (
        <RadixDialog.Title
            ref={ref}
            className={classNames(styles.title, className)}
            {...restProps}
        />
    ),
);
DialogTitle.displayName = 'DialogTitle';

export type DialogDescriptionProps = RadixDialog.DialogDescriptionProps;

export const DialogDescription = React.forwardRef<HTMLDivElement, DialogDescriptionProps>(
    ({ className, ...restProps }: DialogDescriptionProps, ref) => (
        <RadixDialog.Title
            ref={ref}
            className={classNames(styles.description, className)}
            {...restProps}
        />
    ),
);
DialogDescription.displayName = 'DialogDescription';

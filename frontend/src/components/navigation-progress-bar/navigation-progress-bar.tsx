import { useNavigation } from '@remix-run/react';
import { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';

import styles from './navigation-progress-bar.module.scss';

export interface NavigationProgressBarProps {
    className?: string;
}

/**
 * A slim progress bar displayed at the top of the page during client-side
 * navigation. It provides visual feedback since browsers don't show a loading
 * indicator when pages load via client-side routing.
 */
export const NavigationProgressBar: FC<NavigationProgressBarProps> = ({ className }) => {
    const progressBarRef = useRef<HTMLDivElement>(null);
    const navigation = useNavigation();
    const isLoading = navigation.state !== 'idle';

    useEffect(() => {
        const div = progressBarRef.current!;
        if (isLoading) {
            div.classList.remove(styles.finished);
            div.getAnimations().forEach((animation) => animation.cancel());
            div.classList.add(styles.loading);
        } else if (div.classList.contains(styles.loading)) {
            div.classList.remove(styles.loading);
            div.classList.add(styles.finished);
        }
    }, [isLoading]);

    return <div ref={progressBarRef} className={classNames(styles.progressBar, className)} />;
};

import { useEffect, useRef, type HTMLAttributes } from 'react';
import { clamp, lerp, remap } from './common';
import styles from './background-parallax.module.scss';

export interface BackgroundParallaxProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A number between 0 and 1 that defines the strength of the parallax
     * effect, default: 0.75.
     * - 0: No parallax effect, the background scrolls at the same rate as the
     *   content, similar to `background-attachment: scroll`.
     * - 1: Maximum parallax effect, the background remains fixed relative to
     *   viewport, similar to `background-attachment: fixed`.
     */
    parallaxStrength?: number;
    /** @format media-url */
    _backgroundImageUrl?: string;
    _style?: React.CSSProperties;
}

interface CalculateBackgroundParallaxParams {
    viewportHeight: number;
    elementTop: number;
    elementHeight: number;
    parallaxStrength: number;
}

function calculateBackgroundParallax({
    viewportHeight,
    elementTop,
    elementHeight,
    parallaxStrength
}: CalculateBackgroundParallaxParams): number {
    const scrollProgress = clamp(
        remap(elementTop, viewportHeight, -elementHeight, 0, 1),
        0,
        1
    );
    return lerp(0, elementHeight * parallaxStrength, scrollProgress);
}

/**
 * A visual effect where the container's background image (set via CSS or inline
 * styles) scrolls at a slower rate than the foreground content, creating a
 * parallax effect. The background image is guaranteed to fully cover the
 * visible area of the container at all times, with no gaps, regardless of the
 * container size, background image dimensions, or viewport size.
 */
export function BackgroundParallax({
    _backgroundImageUrl,
    _style,
    ...props
}: BackgroundParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleLayoutChange = () => {
            const elementRect = element.getBoundingClientRect();
            const backgroundPositionY = calculateBackgroundParallax({
                viewportHeight: window.innerHeight,
                elementTop: elementRect.top,
                elementHeight: elementRect.height,
                parallaxStrength: props.parallaxStrength || 0.75,
            });
            element.style.backgroundPositionY = backgroundPositionY + 'px';
        };

        window.addEventListener('scroll', handleLayoutChange);
        window.addEventListener('resize', handleLayoutChange);
        const resizeObserver = new ResizeObserver(handleLayoutChange);
        resizeObserver.observe(element);

        return () => {
            window.removeEventListener('scroll', handleLayoutChange);
            window.removeEventListener('resize', handleLayoutChange);
            resizeObserver.disconnect();
        };
    }, [props.parallaxStrength]);

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <div className={styles.contentInner} />
            </div>
        </div>
    );
}

/**
 * Calculates the `background-position-y` value based on scroll position
 */

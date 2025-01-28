/**
 * Returns a set of attributes to make a non-interactive HTML element such as
 * a `<div>` clickable with both mouse and keyboard.
 *
 * @example
 * <div {...getClickableElementAttributes(onClick)}>Click me</div>
 */
export const getClickableElementAttributes = (
    onClick: (event: React.MouseEvent | React.KeyboardEvent) => void,
): React.HTMLAttributes<HTMLElement> => ({
    role: 'button',
    tabIndex: 0,
    onClick,
    onKeyUp: (event: React.KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            onClick(event);
        }
    },
});

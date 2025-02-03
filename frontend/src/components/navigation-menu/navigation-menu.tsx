import classNames from 'classnames';
import { NavLink } from '@remix-run/react';
import { CategoryLink } from '../category-link/category-link';
import styles from './navigation-menu.module.scss';

interface NavigationMenuProps {
    className?: string;
    vertical?: boolean;
}

export const NavigationMenu = ({ className, vertical = false }: NavigationMenuProps) => {
    const menuItemStyle = ({ isActive }: { isActive: boolean }) =>
        classNames(styles.menuItem, {
            [styles.active]: isActive,
        });

    return (
        <nav className={className}>
            <ul className={classNames(styles.menuList, { [styles.vertical]: vertical })}>
                <li>
                    <CategoryLink categorySlug="all" className={menuItemStyle}>
                        Shop All
                    </CategoryLink>
                </li>
                <li>
                    <CategoryLink categorySlug="rope" className={menuItemStyle}>
                        Robe
                    </CategoryLink>
                </li>
                <li>
                    <CategoryLink categorySlug="jumpsuit" className={menuItemStyle}>
                        Jumpsuit
                    </CategoryLink>
                </li>
                <li>
                    <CategoryLink categorySlug="jupe" className={menuItemStyle}>
                        Jupe
                    </CategoryLink>
                </li>
                <li>
                    <NavLink to="/about-us" className={menuItemStyle}>
                        About Us
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

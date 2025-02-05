import { Link, NavLink } from '@remix-run/react';
import classNames from 'classnames';
import { CategoryLink } from '~/src/components/category-link/category-link';
import { FadeIn } from '~/src/components/visual-effects';

import styles from './footer.module.scss';

export interface FooterProps {
    className?: string;
}

export const Footer = ({ className }: FooterProps) => {
    const navItemStyle = ({ isActive }: { isActive: boolean }) =>
        classNames(styles.navItem, {
            [styles.active]: isActive,
        });

    return (
        <footer className={classNames(styles.root, className)}>
            <FadeIn className={styles.navigation} duration={1.8}>
                <nav>
                    <ul className={styles.navList}>
                        <li>
                            <CategoryLink categorySlug="all-products" className={navItemStyle}>
                                All Products
                            </CategoryLink>
                        </li>
                        <li>
                            <CategoryLink categorySlug="jumpsuit" className={navItemStyle}>
                                Jumpsuit
                            </CategoryLink>
                        </li>
                        <li>
                            <CategoryLink categorySlug="robe" className={navItemStyle}>
                                Robe
                            </CategoryLink>
                        </li>
                        <li>
                            <CategoryLink categorySlug="jupe" className={navItemStyle}>
                                Jupe
                            </CategoryLink>
                        </li>
                        <li>
                            <CategoryLink categorySlug="new" className={navItemStyle}>
                                New
                            </CategoryLink>
                        </li>
                        <li>
                            <CategoryLink categorySlug="sale" className={navItemStyle}>
                                Sale
                            </CategoryLink>
                        </li>
                        <li>
                            <NavLink to="/about-us" className={navItemStyle}>
                                About Us
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <ul className={styles.navList}>
                    
                    
                    <li>
                        <NavLink to="/Ordring-policy" className={navItemStyle}>
                            Ordring Policy
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/delivery-information" className={navItemStyle}>
                            Delivery Information
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/refund-policy" className={navItemStyle}>
                            Refund Policy
                        </NavLink>
                    </li>
                </ul>
                <ul className={styles.navList}>
                    <li>
                        <Link
                            to={import.meta.env.VITE_FACEBOOK_URL}
                            className={styles.navItem}
                            target="_blank"
                        >
                            Facebook
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={import.meta.env.VITE_INSTAGRAM_URL}
                            className={styles.navItem}
                            target="_blank"
                        >
                            Instagram
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={import.meta.env.VITE_TIKTOK_URL}
                            className={styles.navItem}
                            target="_blank"
                        >
                            TikTok
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                            className={styles.navItem}
                            target="_blank"
                        >
                            WhatsApp
                        </Link>
                    </li>
                </ul>
            </FadeIn>
            <FadeIn className={styles.bottomBar} duration={1.8}>
                <Link to="/" className={styles.logo}>
                    MZ boutique 
                </Link>
                <div className={styles.copyright}>
                    <span>© {new Date().getFullYear()} MZ boutique . All rights reserved.</span>
                </div>
            </FadeIn>
        </footer>
    );
};

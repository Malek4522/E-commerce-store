import { Link, useNavigate } from '@remix-run/react';
import classNames from 'classnames';
import { useState } from 'react';
import { SidebarNavigationMenu } from '../sidebar-navigation-menu/sidebar-navigation-menu';

import styles from './header.module.scss';

export interface HeaderProps {
    className?: string;
}

export const Header = ({ className }: HeaderProps) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const _onSearchSubmit = (search: string) => {
        navigate(`/products/all-products?search=${encodeURIComponent(search)}`);
    };

    return (
        <header className={classNames(styles.root, className)}>
            <section className={styles.topBar}>
                <Link to="/" className={styles.logo}>
                    MZ Prestige
                </Link>
                <div className={styles.div1}>
                    <Link className={styles.shopNow} to="/products/all-products">
                        Acheter Maintenant
                    </Link>
                </div>
            </section>

            <SidebarNavigationMenu open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </header>
    );
};

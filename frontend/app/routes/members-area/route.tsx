import classNames from 'classnames';
import { Outlet, NavLink } from '@remix-run/react';

import styles from './route.module.scss';

export default function MembersAreaPage() {
    const tabClassName = ({ isActive }: { isActive: boolean }) => {
        return classNames('tab', { active: isActive });
    };

    return (
        <div className={styles.page}>
            <div className="tabs">
                <NavLink to={'/members-area/my-account'} className={tabClassName}>
                    My Account
                </NavLink>
                <NavLink to={'/members-area/my-orders'} className={tabClassName}>
                    My Orders
                </NavLink>
            </div>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}

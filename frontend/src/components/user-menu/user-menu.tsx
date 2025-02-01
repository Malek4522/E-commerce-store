import { NavLink } from '@remix-run/react';
import { Avatar } from '~/src/components/avatar/avatar';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '~/src/components/dropdown-menu/dropdown-menu';
import { DropdownIcon } from '~/src/components/icons';
import { useUserInfo } from '~/src/api/users';

import styles from './user-menu.module.scss';

export const UserMenu = () => {
    const { isLoggedIn, user } = useUserInfo();

    if (!isLoggedIn) {
        return (
            <NavLink className={styles.root} to={'/login'}>
                <Avatar imageSrc={undefined} />
                Log In
            </NavLink>
        );
    }

    return (
        <DropdownMenu
            trigger={
                <button className={styles.root}>
                    <Avatar imageSrc={undefined} />
                    <span className={styles.name}>
                        {user?.firstName} {user?.lastName}
                    </span>
                    <DropdownIcon width={10} height={10} />
                </button>
            }
            contentProps={{
                align: 'end',
                sideOffset: 6,
            }}
        >
            <DropdownMenuItem asChild>
                <NavLink className={styles.link} to={'/members-area/my-account'}>
                    My Account
                </NavLink>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
                <NavLink className={styles.link} to={'/members-area/my-orders'}>
                    My Orders
                </NavLink>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
                <NavLink className={styles.link} to={'/logout'}>
                    Log out
                </NavLink>
            </DropdownMenuItem>
        </DropdownMenu>
    );
};

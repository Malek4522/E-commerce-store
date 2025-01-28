import { LoaderFunctionArgs, redirect, TypedResponse } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/react';
import { Form, useLoaderData, useNavigation } from '@remix-run/react';
import { Member } from '~/src/wix/ecom';
import classNames from 'classnames';
import { useState } from 'react';
import { Dialog, DialogDescription, DialogTitle } from '~/src/components/dialog/dialog';
import { Spinner } from '~/src/components/spinner/spinner';
import { initializeEcomApiForRequest } from '~/src/wix/ecom/session';
import { loaderMockData } from './loader-mock-data';

import styles from './route.module.scss';

export type LoaderResponseData = { user: Member | undefined };
export type LoaderResponse = Promise<TypedResponse<never> | LoaderResponseData>;

export async function loader({ request }: LoaderFunctionArgs): LoaderResponse {
    const api = await initializeEcomApiForRequest(request);
    if (!api.isLoggedIn()) {
        return redirect('/login');
    }

    const user = await api.getUser();
    return { user };
}

// will be called if app is run in Codux because fetching user details requires
// user to be logged in but it's currently can't be done through Codux
export async function coduxLoader(): ReturnType<typeof loader> {
    return loaderMockData;
}

export default function MyAccountPage() {
    const { user } = useLoaderData<typeof loader>();

    const initialUserDetailsFormData = {
        firstName: user?.contact?.firstName ?? '',
        lastName: user?.contact?.lastName ?? '',
        phoneNumber: user?.contact?.phones?.[0] ?? '',
    };

    const [userDetailsFormData, setUserDetailsFormData] = useState(initialUserDetailsFormData);
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);

    const onDiscardChangesClick = () => {
        setDiscardConfirmationOpen(true);
    };

    const handleDiscardChanges = () => {
        setUserDetailsFormData(initialUserDetailsFormData);
        setDiscardConfirmationOpen(false);
    };

    const navigation = useNavigation();

    const userDetailsFormAction = '/members-area/my-account/update-details';
    const resetPasswordFormAction = '/members-area/my-account/reset-password';

    const isUpdatingUserDetails =
        navigation.state === 'submitting' && navigation.formAction === userDetailsFormAction;

    const isResettingPassword =
        navigation.state === 'submitting' && navigation.formAction === resetPasswordFormAction;

    return (
        <div>
            <div className={classNames(styles.section, styles.header)}>
                <div>
                    <h2 className="heading4">Account</h2>
                    <span className="paragraph1">View and edit your personal info below.</span>
                </div>
                <div className={styles.actions}>
                    <button
                        className={classNames('button', 'secondaryButton', 'smallButton')}
                        onClick={onDiscardChangesClick}
                    >
                        Discard
                    </button>
                    <button
                        className={classNames(
                            'button',
                            'primaryButton',
                            'smallButton',
                            styles.updateInfoButton,
                        )}
                        disabled={isUpdatingUserDetails}
                        form="user-details-form"
                        type="submit"
                    >
                        {isUpdatingUserDetails ? <Spinner size={24} /> : 'Update Info'}
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <div>
                    <h2 className="heading5">Personal info</h2>
                    <span className="paragraph1">Update you personal information.</span>
                </div>

                <Form
                    id="user-details-form"
                    method="post"
                    action={userDetailsFormAction}
                    className={styles.userDetailsForm}
                >
                    <input type="hidden" name="userId" value={user?._id ?? undefined} />

                    <label>
                        First Name
                        <input
                            className="textInput"
                            name="firstName"
                            value={userDetailsFormData.firstName}
                            onChange={(e) =>
                                setUserDetailsFormData((current) => ({
                                    ...current,
                                    firstName: e.target.value,
                                }))
                            }
                        />
                    </label>

                    <label>
                        Last Name
                        <input
                            className="textInput"
                            name="lastName"
                            value={userDetailsFormData.lastName}
                            onChange={(e) =>
                                setUserDetailsFormData((current) => ({
                                    ...current,
                                    lastName: e.target.value,
                                }))
                            }
                        />
                    </label>

                    <label>
                        Phone
                        <input
                            className="textInput"
                            name="phoneNumber"
                            value={userDetailsFormData.phoneNumber}
                            onChange={(e) =>
                                setUserDetailsFormData((current) => ({
                                    ...current,
                                    phoneNumber: e.target.value,
                                }))
                            }
                        />
                    </label>
                </Form>

                <div className={styles.actions}>
                    <button
                        className={classNames('button', 'secondaryButton', 'smallButton')}
                        onClick={onDiscardChangesClick}
                    >
                        Discard
                    </button>
                    <button
                        className={classNames(
                            'button',
                            'primaryButton',
                            'smallButton',
                            styles.updateInfoButton,
                        )}
                        disabled={isUpdatingUserDetails}
                        form="user-details-form"
                        type="submit"
                    >
                        {isUpdatingUserDetails ? <Spinner size={24} /> : 'Update Info'}
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <div>
                    <h2 className="heading5">Login info</h2>
                    <span className="paragraph1">View your login email and reset password.</span>
                </div>

                <Form
                    id="reset-password-form"
                    method="post"
                    action={resetPasswordFormAction}
                    className={styles.loginInfoSection}
                >
                    <div>
                        <div>Login email:</div>
                        <div>{user?.loginEmail}</div>
                        <input type="hidden" name="email" value={user?.loginEmail ?? undefined} />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="submit"
                            className={classNames(
                                'button',
                                'primaryButton',
                                'smallButton',
                                styles.resetPasswordButton,
                            )}
                            disabled={isResettingPassword}
                        >
                            {isResettingPassword ? <Spinner size={22} /> : 'Reset password'}
                        </button>
                    </div>
                </Form>
            </div>

            <Dialog
                open={discardConfirmationOpen}
                onOpenChange={(open) => setDiscardConfirmationOpen(open)}
            >
                <DialogTitle className={styles.title}>Discard changes?</DialogTitle>
                <DialogDescription>Any changes you made will be lost.</DialogDescription>
                <div className={styles.confirmationDialogBody}>
                    <button
                        className={classNames('button', 'secondaryButton', 'smallButton')}
                        onClick={() => setDiscardConfirmationOpen(false)}
                    >
                        Keep Editing
                    </button>
                    <button
                        className={classNames('button', 'primaryButton', 'smallButton')}
                        onClick={handleDiscardChanges}
                    >
                        Discard Changes
                    </button>
                </div>
            </Dialog>
        </div>
    );
}

export const meta: MetaFunction = () => {
    return [
        { title: 'My Account | ReClaim' },
        {
            name: 'description',
            content: 'Essential home products for sustainable living',
        },
        {
            property: 'robots',
            content: 'noindex, nofollow',
        },
    ];
};

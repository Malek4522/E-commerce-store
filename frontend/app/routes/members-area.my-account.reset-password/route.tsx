import { json, redirect, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { Input } from '~/src/components/input/input';
import { initializeApiForRequest } from '~/src/api/session';
import { getErrorMessage } from '~/src/utils';
import styles from './route.module.scss';

interface ActionData {
    success?: boolean;
    error?: string;
}

export async function action({ request }: ActionFunctionArgs) {
    const { isAuthenticated } = await initializeApiForRequest(request);
    if (!isAuthenticated) {
        return json<ActionData>({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            return json<ActionData>({ error: 'Passwords do not match' }, { status: 400 });
        }

        // TODO: Implement password reset
        return redirect('/members-area/my-account');
    } catch (error) {
        return json<ActionData>({ error: getErrorMessage(error) }, { status: 400 });
    }
}

export default function ResetPasswordRoute() {
    const actionData = useActionData<typeof action>();

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Reset Password</h1>
            <Form method="post" className={styles.form}>
                <Input
                    name="currentPassword"
                    type="password"
                    label="Current Password"
                    required
                    hasError={!!actionData?.error}
                />
                <Input
                    name="newPassword"
                    type="password"
                    label="New Password"
                    required
                    hasError={!!actionData?.error}
                />
                <Input
                    name="confirmPassword"
                    type="password"
                    label="Confirm New Password"
                    required
                    hasError={!!actionData?.error}
                />
                {actionData?.error && (
                    <div className={styles.error}>{actionData.error}</div>
                )}
                <button type="submit" className={styles.submit}>
                    Reset Password
                </button>
            </Form>
        </div>
    );
}

// will be called if app is run in Codux because sending reset password email
// requires user to be logged in but it's currently can't be done through Codux
export async function coduxAction() {
    // using redirect helper here causes warning during build process
    return new Response(null, {
        status: 302,
        headers: {
            Location: '/members-area/my-account',
        },
    });
}

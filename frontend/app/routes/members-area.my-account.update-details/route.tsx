import { json, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { Input } from '~/src/components/input/input';
import { updateUser } from '~/src/api/users';
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
        const userData = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
        };

        await updateUser(userData);
        return json<ActionData>({ success: true });
    } catch (error) {
        return json<ActionData>({ error: getErrorMessage(error) }, { status: 400 });
    }
}

export default function UpdateDetailsRoute() {
    const actionData = useActionData<typeof action>();

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Update Details</h1>
            <Form method="post" className={styles.form}>
                <Input
                    name="firstName"
                    label="First Name"
                    required
                    hasError={!!actionData?.error}
                />
                <Input
                    name="lastName"
                    label="Last Name"
                    required
                    hasError={!!actionData?.error}
                />
                <Input
                    name="email"
                    type="email"
                    label="Email"
                    required
                    hasError={!!actionData?.error}
                />
                <Input
                    name="phone"
                    type="tel"
                    label="Phone"
                    hasError={!!actionData?.error}
                />
                {actionData?.error && (
                    <div className={styles.error}>{actionData.error}</div>
                )}
                <button type="submit" className={styles.submit}>
                    Update Details
                </button>
            </Form>
        </div>
    );
}

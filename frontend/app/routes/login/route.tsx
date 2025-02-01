import { json, redirect, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { Input } from '~/src/components/input/input';
import { login } from '~/src/api/users';
import { getSession, commitSession } from '~/src/api/session';
import { getErrorMessage } from '~/src/utils';
import styles from './route.module.scss';

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const { token, user } = await login(email, password);
        const session = await getSession(request);
        session.set('token', token);
        session.set('userId', user.id);

        return redirect('/members-area/my-account', {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        });
    } catch (error) {
        return json({ error: getErrorMessage(error) }, { status: 400 });
    }
}

export default function LoginRoute() {
    const actionData = useActionData<typeof action>();

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Login</h1>
            <Form method="post" className={styles.form}>
                <Input
                    name="email"
                    type="email"
                    label="Email"
                    required
                    hasError={!!actionData?.error}
                />
                <Input
                    name="password"
                    type="password"
                    label="Password"
                    required
                    hasError={!!actionData?.error}
                />
                {actionData?.error && (
                    <div className={styles.error}>{actionData.error}</div>
                )}
                <button type="submit" className={styles.submit}>
                    Log In
                </button>
            </Form>
        </div>
    );
}

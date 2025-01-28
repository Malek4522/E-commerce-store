import { Toaster as ReactHotToaster } from 'react-hot-toast';
import { Toast } from '~/src/components/toast/toast';

/**
 * Renders a stack of toast notifications. Add this component after the root
 * element of your app.
 */
export const Toaster = () => (
    <ReactHotToaster containerStyle={{ inset: 10 }} position="top-center" gutter={10}>
        {(toast) => <Toast toast={toast} />}
    </ReactHotToaster>
);

import type { MetaFunction } from '@remix-run/react';
import styles from './route.module.scss';

export default function DeliveryInformationPage() {
    return (
        <div className="textPage">
            <h1>Informations de livraison - معلومات التوصيل</h1>
            <div className={styles.div1}>
                <p className={styles.text}>
                    يتم النقل عن طريق ZR EXPRESS مع متوسط وقت التسليم يومين، وثلاثة أيام كحد أقصى
                </p>
                <p className={styles.text}>
                    Le transport est assuré par ZR EXPRESS avec une durée de livraison de 2 jours en moyenne, 3 jours maximum.
                </p>
            </div>
        </div>
    );
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Delivery Information | MZ Prestige' },
        {
            name: 'description',
            content: 'Essential home products for sustainable living',
        },
        {
            property: 'robots',
            content: 'index, follow',
        },
    ];
}; 
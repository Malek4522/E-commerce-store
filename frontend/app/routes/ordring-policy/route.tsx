import type { MetaFunction } from '@remix-run/react';
import React from 'react';
import styles from './route.module.scss';

export default function OrderingPolicyPage() {
    return (
        <div className="textPage">
            <h1>Ordring Policy-سياسات نظام الطلبات </h1>
            <div className={styles.div1}>
                <p>
                    بعد اختيار المنتج وطلب التوصيل، سنتصل بك على الرقم الذي قدمته لتأكيد الطلب.
                    يمكنك إلغاء الطلب في أي وقت عن طريق الاتصال بنا.عند التسليم، يمكنك فحص المنتج
                    للتأكد من أنه مشابه للصور وغير تالف. إذا قبلته، قم بدفع المبلغ للمندوب وتنتهي
                    الصفقة. إذا لم تعجبك، يمكنك ببساطة رفض الطلب.الطلبات المشتراة لا يمكن إرجاعها أو
                    استبدالها إلا إذا تم توصيل مقاسات أو ألوان خاطئة. في هذه الحالة، نقوم باستبدالها
                    مع توصيل مجاني. في غير ذلك، سيتعين عليك دفع رسوم التوصيل مرة أخرى.
                </p>
                <p>
                    Après avoir sélectionné le produit et effectué une demande de livraison, nous
                    vous appellerons au numéro que vous avez fourni pour confirmer la commande. Vous
                    pouvez annuler la commande à tout moment en nous appelant.Lors de la livraison,
                    vous pouvez vérifier si le produit correspond aux photos et s&apos;il n&apos;est
                    pas endommagé. Si vous l&apos;acceptez, vous payez le livreur et la transaction
                    est terminée. Sinon, vous pouvez simplement refuser la commande.Les commandes
                    achetées ne peuvent pas être retournées ou échangées, sauf si nous livrons des
                    tailles ou des couleurs incorrectes. Dans ce cas, nous les remplaçons avec
                    livraison gratuite. Sinon, vous devrez payer à nouveau les frais de livraison.
                </p>
            </div>
        </div>
    );
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Ordring Policy | ReClaim' },
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
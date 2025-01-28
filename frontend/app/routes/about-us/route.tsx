import type { MetaFunction } from '@remix-run/react';
import { FadeIn, Reveal } from '~/src/components/visual-effects';
import styles from './route.module.scss';

export default function AboutUsPage() {
    return (
        <div className={styles.root}>
            <Reveal className={styles.aboutSection} direction="up" duration={3}>
                <h1 className={styles.title}>We are ReClaim</h1>
                <div className={styles.subtitle}>Une boutique tenue par des femmes.</div>
                <div className={styles.description}>
                    Nous proposons une superbe collection de robes, jupes et combinaisons. Tous nos
                    produits sont 100 % originaux et proviennent directement de Turquie. Nous sommes
                    situés à Blida. Venez nous rendre visite pour découvrir la qualité et le style !
                </div>
            </Reveal>
            <FadeIn duration={2}>
                <img
                    className={styles.image}
                    src="https://static.wixstatic.com/media/c837a6_825d7dbd2e634114906169b9674b56fa~mv2.jpg"
                    alt=""
                />
            </FadeIn>
        </div>
    );
}

export const meta: MetaFunction = () => {
    return [
        { title: 'About ReClaim' },
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

import type { MetaFunction } from '@remix-run/react';
import { CategoryLink } from '~/src/components/category-link/category-link';
import { FeaturedProductsSection } from '~/src/components/featured-products-section/featured-products-section';
import { LabelWithArrow } from '~/src/components/label-with-arrow/label-with-arrow';
import { BackgroundParallax, FadeIn, FloatIn } from '~/src/components/visual-effects';
import BJpg from '../../../src/assets/b.jpg';
import CJpg from '../../../src/assets/c.jpg';
import DWebp from '../../../src/assets/d.webp';
import DJpeg from '../../../src/assets/d.jpeg';
import styles from './route.module.scss';
import classNames from 'classnames';

export default function HomePage() {
    return (
        <div>
            <div className="heroBanner">
                <img src={BJpg} className="heroBannerImage" alt="" />
                <div className="heroBannerOverlay">
                    <h1 className={classNames('heroBannerTitle', styles.header1)}>
                        Consultez notre soirée cloth
                    </h1>
                    <CategoryLink categorySlug="all-products">
                        <LabelWithArrow>Shop Collections</LabelWithArrow>
                    </CategoryLink>
                </div>
            </div>

            <div className="textBannerSection">
                <FadeIn className="textBanner" duration={1.8}>
                    <div className="textBannerSubtitle">Des produits de la plus haute qualité.</div>
                    <div className="textBannerTitle">
                        Collections essentielles pour une mode durable.
                    </div>
                    <CategoryLink categorySlug="all-products">
                        <LabelWithArrow>Shop Collections</LabelWithArrow>
                    </CategoryLink>
                </FadeIn>
            </div>

            <div className="cardsSection">
                <CategoryLink categorySlug="kitchen-essentials" className="linkCard">
                    <img className="linkCardBackground" src={CJpg} alt="" />
                    <div className="linkCardTitle">Rope</div>
                </CategoryLink>
                <CategoryLink categorySlug="bath" className="linkCard">
                    <img className="linkCardBackground" src={DWebp} alt="" />
                    <div className="linkCardTitle">Jump Suit</div>
                </CategoryLink>
                <CategoryLink categorySlug="on-the-go" className="linkCard">
                    <img className="linkCardBackground" src={DJpeg} alt="" />
                    <div className="linkCardTitle">jupe</div>
                </CategoryLink>
            </div>

            <BackgroundParallax
                className="floatingCardBackground"
                backgroundImageUrl="https://static.wixstatic.com/media/c837a6_cae4dbe5a7ee4637b7d55d9bd5bd755d~mv2.png/v1/fill/w_1178,h_974,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/c837a6_cae4dbe5a7ee4637b7d55d9bd5bd755d~mv2.png"
                parallaxStrength={0.75}
            >
                <FloatIn direction="up" duration={1.2} distance={120}>
                    <div className="floatingCard">
                        <div className="floatingCardHeader">Happy Holidays</div>
                        <div className="floatingCardContent">
                            <h2 className="floatingCardTitle">The holidays best sellers</h2>
                            <div className="floatingCardDescription">
                                Home essentials for
                                <br /> sustainable living
                            </div>
                        </div>
                        <CategoryLink categorySlug="all-products">
                            <LabelWithArrow>Buy a gift</LabelWithArrow>
                        </CategoryLink>
                    </div>
                </FloatIn>
            </BackgroundParallax>
            <FeaturedProductsSection
                className="alternateBackground"
                categorySlug="new-in"
                title="New In"
                description="Embrace a sustainable lifestyle with our newest drop-ins."
                productCount={4}
            />

            <FeaturedProductsSection
                categorySlug="best-sellers"
                title="Best Sellers"
                productCount={4}
            />
        </div>
    );
}

export const meta: MetaFunction = () => {
    const title = 'ReClaim: Home Goods Store';
    const description = 'Essential home products for sustainable living';

    return [
        { title },
        {
            name: 'description',
            content: description,
        },
        {
            property: 'robots',
            content: 'index, follow',
        },
        {
            property: 'og:title',
            content: title,
        },
        {
            property: 'og:description',
            content: description,
        },
        {
            property: 'og:image',
            content: '/social-media-image.jpg',
        },
    ];
};

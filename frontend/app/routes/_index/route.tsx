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
                <CategoryLink categorySlug="rope" className="linkCard">
                    <img className="linkCardBackground" src={CJpg} alt="" />
                    <div className="linkCardTitle">Rope</div>
                </CategoryLink>
                <CategoryLink categorySlug="jumpsuit" className="linkCard">
                    <img className="linkCardBackground" src={DWebp} alt="" />
                    <div className="linkCardTitle">Jump Suit</div>
                </CategoryLink>
                <CategoryLink categorySlug="jupe" className="linkCard">
                    <img className="linkCardBackground" src={DJpeg} alt="" />
                    <div className="linkCardTitle">jupe</div>
                </CategoryLink>
            </div>

            <BackgroundParallax
                className="floatingCardBackground"
                parallaxStrength={0.75}
            >
                <FloatIn direction="up" duration={1.2} distance={120}>
                    <div className="floatingCard">
                        <div className="floatingCardHeader">Happy Holidays</div>
                        <div className="floatingCardContent">
                            <h2 className="floatingCardTitle">The holidays sales</h2>
                            <div className="floatingCardDescription">
                                Special discounts on
                                <br /> selected items
                            </div>
                        </div>
                        <CategoryLink categorySlug="all-products">
                            <LabelWithArrow>Shop Sales</LabelWithArrow>
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
                categorySlug="sold"
                title="On Sale"
                description="Don't miss out on these amazing deals."
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

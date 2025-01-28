import { createBoard, Variant } from '@wixc3/react-board';
import { Accordion } from '~/src/components/accordion/accordion';
import { ProductCard } from '~/src/components/product-card/product-card';
import { QuantityInput } from '~/src/components/quantity-input/quantity-input';
import { Select, SelectItem } from '~/src/components/select/select';
import classNames from 'classnames';
import { CategoryLink } from '~/src/components/category-link/category-link';
import { ColorSelect } from '~/src/components/color-select/color-select';
import ComponentWrapper from '_codux/board-wrappers/component-wrapper';
import { Kit } from '../ui-kit-utils/kit';

import styles from './components.board.module.scss';

export default createBoard({
    name: 'Components & Elements',
    Board: () => (
        <ComponentWrapper>
            <Kit category="Core Components" title="Components & Elements">
                <Kit.Section title="Inputs">
                    <Kit.Item>
                        <Variant name="Input">
                            <input className="textInput" value="Text input" onChange={() => {}} />
                        </Variant>
                        <Kit.Description>Input</Kit.Description>
                    </Kit.Item>

                    <Kit.Item>
                        <Variant name="Input Placeholder">
                            <input
                                className="textInput"
                                placeholder="Placeholder"
                                value=""
                                onChange={() => {}}
                            />
                        </Variant>
                        <Kit.Description>Input Placeholder</Kit.Description>
                    </Kit.Item>

                    <Kit.Item>
                        <Variant name="Disabled Input">
                            <input
                                disabled
                                className="textInput"
                                value="Disabled input"
                                onChange={() => {}}
                            />
                        </Variant>
                        <Kit.Description>Disabled Input</Kit.Description>
                    </Kit.Item>

                    <Kit.Item>
                        <Variant name="Number Input">
                            <QuantityInput value={6} onChange={() => {}} />
                        </Variant>
                        <Kit.Description>Number Input</Kit.Description>
                    </Kit.Item>
                </Kit.Section>

                <Kit.Section title="Selects" className={styles.demoWidth}>
                    <Kit.Item>
                        <Variant name="Select">
                            <Select value="" onValueChange={() => {}} placeholder="Select value">
                                <SelectItem value="option-1">Option 1</SelectItem>
                                <SelectItem value="option-2">Option 2</SelectItem>
                                <SelectItem value="option-3">Option 3</SelectItem>
                            </Select>
                        </Variant>
                        <Kit.Description>Select</Kit.Description>
                    </Kit.Item>

                    <Kit.Item>
                        <Variant name="Color Select">
                            <ColorSelect
                                className="colorSelect"
                                selectedId="color2"
                                onChange={() => {}}
                                options={[
                                    { id: 'color1', color: 'white' },
                                    { id: 'color2', color: 'black' },
                                    { id: 'color3', color: '#00a400' },
                                    { id: 'color4', color: 'rgb(214, 122, 127)' },
                                    { id: 'color5', color: 'hsl(30deg 82% 43%)' },
                                ]}
                            />
                        </Variant>
                        <Kit.Description>Color Select</Kit.Description>
                    </Kit.Item>
                </Kit.Section>

                <Kit.Section title="Accordion">
                    <Kit.Item className={styles.demoWidth}>
                        <Variant name="Accordion">
                            <Accordion
                                items={[
                                    {
                                        header: 'Product Info',
                                        content: 'Content',
                                    },
                                    {
                                        header: 'Return & Refund Policy',
                                        content: 'Content',
                                    },
                                    {
                                        header: 'Shipping Info ',
                                        content: 'Content',
                                    },
                                ]}
                            />
                        </Variant>
                        <Kit.Description>Accordion</Kit.Description>
                    </Kit.Item>
                </Kit.Section>

                <Kit.Section title="Labels">
                    <Kit.Item>
                        <Variant name="Ribbon">
                            <span className="ribbon">Sale</span>
                        </Variant>
                        <Kit.Description>Ribbon</Kit.Description>
                    </Kit.Item>
                </Kit.Section>

                <Kit.Section title="Cards">
                    <Kit.Item className={styles.demoWidth}>
                        <Variant name="Product Card">
                            <ProductCard
                                name="Bamboo Toothbrush"
                                imageUrl="https://static.wixstatic.com/media/c837a6_18152edaef9940ca88f446ae94b48a47~mv2.jpg/v1/fill/w_824,h_1098,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/c837a6_18152edaef9940ca88f446ae94b48a47~mv2.jpg"
                                ribbon="NEW"
                                price="$6"
                                discountedPrice="$5.5"
                            />
                        </Variant>
                        <Kit.Description>Product Card</Kit.Description>
                    </Kit.Item>
                    <Kit.Item className={classNames(styles.demoWidth, styles.linkCardWrapper)}>
                        <Variant name="Link Card">
                            <CategoryLink categorySlug="all-products" className="linkCard">
                                <img
                                    className="linkCardBackground"
                                    src="https://static.wixstatic.com/media/c837a6_c05a03f48fbd49e7b5046d1b18c930eb~mv2.jpg/v1/fill/w_547,h_730,q_90/c837a6_c05a03f48fbd49e7b5046d1b18c930eb~mv2.jpg"
                                    alt=""
                                />
                                <div className="linkCardTitle">All Products</div>
                            </CategoryLink>
                        </Variant>
                        <Kit.Description>Link Card</Kit.Description>
                    </Kit.Item>
                </Kit.Section>
            </Kit>
        </ComponentWrapper>
    ),
    environmentProps: {
        windowWidth: 320,
        windowHeight: 800,
    },
    isSnippet: true,
});

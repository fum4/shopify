import '@shopify/ui-extensions/preact';
import {render} from "preact";
import { /* useMetafield, */ useTranslate, useTotalAmount} from '@shopify/ui-extensions/checkout/preact';

interface ExtensionSettings {
  heading?: string;
  description?: string;
  tone?: 'auto' | 'info' | 'success' | 'warning' | 'critical';
  collapsible?: boolean;
}

const DISCOUNT_PERCENTAGE = 15;

export default function() {
  render(<Extension />, document.body)
}

function Extension() {
  const translate = useTranslate();
  const totalAmount = useTotalAmount();

  // const isVIP = useMetafield({
  //   namespace: 'custom',
  //   key: 'is_vip',
  // });

  // if (!isVIP?.value) {
  //   return null;
  // }

  // Calculate savings amount
  // If current total is 85% of original (after 15% discount), then discount = total × (15/85)
  const savingAmount = totalAmount
    ? (Number(totalAmount.amount) * DISCOUNT_PERCENTAGE / (100 - DISCOUNT_PERCENTAGE)).toFixed(2)
    : '0.00';

  const {
    heading = translate('defaultHeading'),
    description = translate('defaultDescription', { savingAmount, percentageAmount: DISCOUNT_PERCENTAGE }),
    tone = 'success',
    collapsible,
  } = (shopify.settings.value || {}) as ExtensionSettings;
  
  const descriptionLines = description
    .split('<br />')
    .map(line => line.trim());

  return (
    <s-banner heading={heading} tone={tone} collapsible={collapsible}>
      {descriptionLines.map((line, index) => (
        <s-paragraph key={index}>{line}</s-paragraph>
      ))}
    </s-banner>
  );
}
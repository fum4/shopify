import {
  DiscountClass,
  OrderDiscountSelectionStrategy,
  CartInput,
  CartLinesDiscountsGenerateRunResult,
} from '../generated/api';
import locales from '../locales/en.default.json';

const DISCOUNT_PERCENTAGE = 15;
const DISCOUNT_MESSAGE = `${DISCOUNT_PERCENTAGE}% ${locales.discountMessage}`;

export function cartLinesDiscountsGenerateRun(
  input: CartInput,
): CartLinesDiscountsGenerateRunResult {
  if (!input.cart.lines.length) {
    throw new Error(locales.errorNoCartLines);
  }

  const isVIP = input.cart.buyerIdentity?.customer?.hasAnyTag ?? false;
  const hasOrderDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Order,
  );

  if (!isVIP || !hasOrderDiscountClass) {
    return {operations: []};
  }

  return {
    operations: [{
      orderDiscountsAdd: {
        candidates: [
          {
            message: DISCOUNT_MESSAGE,
            targets: [
              {
                orderSubtotal: {
                  excludedCartLineIds: [],
                },
              },
            ],
            value: {
              percentage: {
                value: DISCOUNT_PERCENTAGE,
              },
            },
          },
        ],
        selectionStrategy: OrderDiscountSelectionStrategy.First,
      },
    }],
  };
}
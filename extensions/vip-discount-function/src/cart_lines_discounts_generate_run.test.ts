import {describe, it, expect} from "vitest";

import {cartLinesDiscountsGenerateRun} from "./cart_lines_discounts_generate_run";
import {
  OrderDiscountSelectionStrategy,
  DiscountClass,
  CartInput,
  CartLinesDiscountsGenerateRunResult,
} from "../generated/api";

describe("cartLinesDiscountsGenerateRun", () => {
  const baseInput: CartInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/0",
          cost: {
            subtotalAmount: {
              amount: 100,
            },
          },
        },
      ],
      buyerIdentity: {
        customer: {
          hasAnyTag: false,
        },
      },
    },
    discount: {
      discountClasses: [],
    },
  };

  it("returns empty operations when customer is not VIP", () => {
    const input: CartInput = {
      ...baseInput,
      cart: {
        ...baseInput.cart,
        buyerIdentity: {
          customer: {
            hasAnyTag: false,
          },
        },
      },
      discount: {
        discountClasses: [DiscountClass.Order],
      },
    };

    const result: CartLinesDiscountsGenerateRunResult =
      cartLinesDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(0);
  });

  it("returns empty operations when no discount classes are present", () => {
    const input: CartInput = {
      ...baseInput,
      cart: {
        ...baseInput.cart,
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
      },
      discount: {
        discountClasses: [],
      },
    };

    const result: CartLinesDiscountsGenerateRunResult =
      cartLinesDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(0);
  });

  it("returns 15% order discount when customer is VIP and order discount class is present", () => {
    const input: CartInput = {
      ...baseInput,
      cart: {
        ...baseInput.cart,
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
      },
      discount: {
        discountClasses: [DiscountClass.Order],
      },
    };

    const result: CartLinesDiscountsGenerateRunResult =
      cartLinesDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(1);
    expect(result.operations[0]).toMatchObject({
      orderDiscountsAdd: {
        candidates: [
          {
            message: "15% VIP Discount",
            targets: [
              {
                orderSubtotal: {
                  excludedCartLineIds: [],
                },
              },
            ],
            value: {
              percentage: {
                value: 15,
              },
            },
          },
        ],
        selectionStrategy: OrderDiscountSelectionStrategy.First,
      },
    });
  });

});
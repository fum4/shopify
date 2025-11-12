import '@shopify/ui-extensions';

//@ts-ignore
declare module './src/Checkout.tsx' {
  const shopify: 
    import('@shopify/ui-extensions/purchase.checkout.block.render').Api |
    import('@shopify/ui-extensions/purchase.checkout.reductions.render-before').Api;
  const globalThis: { shopify: typeof shopify };
}

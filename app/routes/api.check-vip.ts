import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");

  if (!customerId) {
    return json({ error: "customerId is required" }, { status: 400 });
  }

  try {
    // Authenticate the request from the storefront
    const { session } = await authenticate.public.appProxy(request);

    if (!session) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query customer tags using Admin API
    const { admin } = await authenticate.public.appProxy(request);

    const response = await admin.graphql(
      `#graphql
      query getCustomerTags($id: ID!) {
        customer(id: $id) {
          tags
        }
      }`,
      {
        variables: {
          id: customerId,
        },
      }
    );

    const data = await response.json();
    const tags = data.data?.customer?.tags || [];
    const isVIP = tags.includes("VIP");

    return json(
      { isVIP },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error checking VIP status:", error);
    return json({ error: "Failed to check VIP status", isVIP: false }, { status: 500 });
  }
}

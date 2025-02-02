import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import StorePriceTable from "~/components/admin/storePriceTable";
import EmptyActivity from "~/components/emptyActivity";

export const loader: LoaderFunction = async ({ request, context, params }) => {
  invariant(params.storeId);

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;

  const priceList = await context.api.get(`/stores/${params.storeId}/prices`, {
    query: {
      page,
      sort: "name",
    },
  });

  return json({ priceList });
};

export default function AdminStoreDetails() {
  const { priceList } = useLoaderData<typeof loader>();

  return (
    <div>
      {priceList.results.length > 0 ? (
        <StorePriceTable priceList={priceList.results} rel={priceList.rel} />
      ) : (
        <EmptyActivity>
          Looks like there's nothing in the database yet. Weird.
        </EmptyActivity>
      )}
    </div>
  );
}

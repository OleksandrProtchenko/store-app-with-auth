import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import Orders from "@/components/Features/Orders/Orders";
import { getOrdersServer } from "@/lib/api/server/apiServerOrders";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: () => getOrdersServer(cookieHeader),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Orders />
    </HydrationBoundary>
  );
}

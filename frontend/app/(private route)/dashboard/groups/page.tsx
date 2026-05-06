import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import Groups from "@/components/Features/Groups/Groups";
import { getOrdersServer } from "@/lib/api/server/apiServerOrders";

export default async function GroupsPage() {
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
      <Groups />
    </HydrationBoundary>
  );
}

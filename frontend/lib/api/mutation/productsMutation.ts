import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProductToOrder,
  deleteProductFromOrder,
} from "../client/apiProducts";
import { queryKeys } from "@/types/queryKeys";

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      product,
    }: Parameters<typeof addProductToOrder>[0] extends never
      ? never
      : {
          orderId: string;
          product: Parameters<typeof addProductToOrder>[1];
        }) => addProductToOrder(orderId, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      productId,
    }: {
      orderId: string;
      productId: string;
    }) => deleteProductFromOrder(orderId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
  });
};

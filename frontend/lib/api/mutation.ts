import { useMutation } from "@tanstack/react-query";
import { login, register } from "./apiClient";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.push("/dashboard/orders");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      router.push("/dashboard/orders");
    },
  });
};

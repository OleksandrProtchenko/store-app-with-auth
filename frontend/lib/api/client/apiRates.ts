import axios from "axios";

const apiNBU = axios.create({
  baseURL: "/api/nbu",
});

export async function getUsdToUahRate(): Promise<number> {
  const FALLBACK_RATE = 41;
  try {
    const { data } = await apiNBU.get<{ rate: number }[]>("", {
      params: { t: "exchange", valcode: "USD", json: true },
    });
    return data?.[0]?.rate ?? FALLBACK_RATE;
  } catch {
    return FALLBACK_RATE;
  }
}

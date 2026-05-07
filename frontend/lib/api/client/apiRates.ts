import axios from "axios";

const nbuApi = axios.create({
  baseURL: "https://bank.gov.ua/NBUStatService/v1/statdataxml",
});

export async function getUsdToUahRate(): Promise<number> {
  const FALLBACK_RATE = 41;
  try {
    const { data } = await nbuApi.get<{ rate: number }[]>("", {
      params: { t: "exchange", valcode: "USD", json: true },
    });
    return data?.[0]?.rate ?? FALLBACK_RATE;
  } catch {
    return FALLBACK_RATE;
  }
}

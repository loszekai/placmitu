import useSWR from "swr";
import { getSearch } from "@/api/search";

export function useSearch(query: string) {
  return useSWR(
    query ? ['search', query] : null,
    ([, q]) => getSearch(q as string),
    {
      revalidateOnFocus: false,
    }
  );
}

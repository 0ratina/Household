import { useQuery, useQueryClient } from "@tanstack/react-query";

const ACTIVE_HOUSEHOLD_KEY = ["activeHousehold"];

export function useActiveHousehold() {
  return useQuery<string | null>({
    queryKey: ACTIVE_HOUSEHOLD_KEY,
    queryFn: () => null,
    initialData: null,
  });
}

export function setActiveHousehold(
  queryClient: ReturnType<typeof useQueryClient>,
  householdId: string
) {
  queryClient.setQueryData(ACTIVE_HOUSEHOLD_KEY, householdId);
}
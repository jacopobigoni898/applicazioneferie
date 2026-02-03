import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

export const useAuthGuard = (
  accessToken: string | null,
  isLoading: boolean,
  isUserLoading: boolean,
) => {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading || isUserLoading) return;

    const inTabs = segments[0] === "(tabs)";
    const atLogin = segments[0] === "login";

    if (!accessToken && inTabs) {
      router.replace("/login");
    }

    if (accessToken && atLogin) {
      router.replace("/(tabs)");
    }
  }, [accessToken, isLoading, isUserLoading, router, segments]);
};

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';
import { getMe } from '../services/auth';
import { requestNotificationPermission } from '../services/notifications';

const queryClient = new QueryClient();

function AuthGuard() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then((me) => setUser(me))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth) router.replace('/(tabs)/');
  }, [user, isLoading, segments]);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="medication/[id]" options={{ headerShown: true, title: 'Medicamento', presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}

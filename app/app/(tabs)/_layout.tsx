import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ACTIVE = '#6366f1';
const INACTIVE = '#94a3b8';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function TabIcon({ name, color }: { name: IconName; color: string }) {
  return <MaterialCommunityIcons name={name} size={24} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: { borderTopColor: '#e2e8f0' },
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { color: '#1e293b', fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoje',
          tabBarIcon: ({ color }) => <TabIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Remédios',
          tabBarIcon: ({ color }) => <TabIcon name="pill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => <TabIcon name="clipboard-text-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          title: 'Estoque',
          tabBarIcon: ({ color }) => <TabIcon name="package-variant-closed" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfis',
          tabBarIcon: ({ color }) => <TabIcon name="account-group-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}

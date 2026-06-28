import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function Icon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: { borderTopColor: '#e2e8f0' },
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { color: '#1e293b', fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hoje',
          tabBarIcon: ({ focused }) => <Icon emoji={focused ? '🏠' : '🏡'} />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Remédios',
          tabBarIcon: ({ focused }) => <Icon emoji={focused ? '💊' : '💊'} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ focused }) => <Icon emoji={focused ? '📋' : '📄'} />,
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          title: 'Estoque',
          tabBarIcon: ({ focused }) => <Icon emoji={focused ? '📦' : '📦'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfis',
          tabBarIcon: ({ focused }) => <Icon emoji={focused ? '👥' : '👤'} />,
        }}
      />
    </Tabs>
  );
}

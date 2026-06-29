import { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useProfileStore } from '../../store/profileStore';
import { getMedications } from '../../services/medications';

export default function MedicationsScreen() {
  const { activeProfile } = useProfileStore();

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ['medications', activeProfile?.id],
    queryFn: () => getMedications(activeProfile!.id),
    enabled: !!activeProfile,
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#6366f1" />
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(m) => String(m.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum medicamento cadastrado.</Text>}
          renderItem={({ item }) => (
            <Link href={`/medication/${item.id}`} asChild>
              <TouchableOpacity style={styles.card}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.dosage}>{item.dosage} {item.unit}</Text>
                  <Text style={styles.schedules}>
                    {item.schedules.length} horário(s) · {item.stock?.current_quantity ?? 0} {item.stock?.unit ?? 'unid'} em estoque
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color="#cbd5e1" />
              </TouchableOpacity>
            </Link>
          )}
        />
      )}

      <Link href="/medication/new" asChild>
        <TouchableOpacity style={styles.fab}>
          <MaterialCommunityIcons name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginRight: 14 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  dosage: { fontSize: 14, color: '#64748b', marginTop: 2 },
  schedules: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  arrow: { fontSize: 22, color: '#cbd5e1' },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#6366f1',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 }, // unused, kept for reference
});

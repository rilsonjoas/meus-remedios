import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useProfileStore } from '../../store/profileStore';
import { getDoseHistory, DoseLog } from '../../services/doses';

const STATUS_LABEL: Record<DoseLog['status'], { label: string; color: string }> = {
  taken: { label: 'Tomado', color: '#22c55e' },
  skipped: { label: 'Pulado', color: '#f59e0b' },
  missed: { label: 'Perdido', color: '#ef4444' },
};

export default function HistoryScreen() {
  const { activeProfile } = useProfileStore();

  const { data, isLoading } = useQuery({
    queryKey: ['history', activeProfile?.id],
    queryFn: () => getDoseHistory(activeProfile!.id),
    enabled: !!activeProfile,
  });

  const logs: DoseLog[] = data?.data ?? [];

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#6366f1" />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(d) => String(d.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum histórico disponível.</Text>}
          renderItem={({ item }) => {
            const status = STATUS_LABEL[item.status];
            return (
              <View style={styles.row}>
                <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                <View style={styles.info}>
                  <Text style={styles.medName}>{item.medication.name}</Text>
                  <Text style={styles.date}>
                    {format(parseISO(item.scheduled_at), "d MMM yyyy 'às' HH:mm", { locale: ptBR })}
                  </Text>
                </View>
                <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  list: { padding: 16, gap: 8 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: 16 },
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  info: { flex: 1 },
  medName: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  date: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  statusLabel: { fontSize: 13, fontWeight: '600' },
});

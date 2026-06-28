import { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useProfileStore } from '../../store/profileStore';
import { getTodayDoses, logDose, DoseLog } from '../../services/doses';
import { api } from '../../services/api';
import { Profile } from '../../store/profileStore';

export default function HomeScreen() {
  const { activeProfile, profiles, setProfiles, setActiveProfile } = useProfileStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    api.get('/profiles').then(({ data }) => setProfiles(data));
  }, []);

  const { data: doses = [], isLoading, refetch } = useQuery({
    queryKey: ['today-doses', activeProfile?.id],
    queryFn: () => getTodayDoses(activeProfile!.id),
    enabled: !!activeProfile,
  });

  const markDose = useMutation({
    mutationFn: (log: DoseLog) =>
      logDose({
        dose_schedule_id: log.dose_schedule_id,
        medication_id: log.medication_id,
        profile_id: log.profile_id,
        scheduled_at: log.scheduled_at,
        taken_at: new Date().toISOString(),
        status: 'taken',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['today-doses'] }),
  });

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.title}>Doses de hoje</Text>
        <FlatList
          data={profiles}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(p) => String(p.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.profileChip, activeProfile?.id === item.id && styles.profileChipActive]}
              onPress={() => setActiveProfile(item)}
            >
              <Text>{item.avatar_emoji} {item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.profileList}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#6366f1" />
      ) : (
        <FlatList
          data={doses}
          keyExtractor={(d) => String(d.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma dose agendada para hoje.</Text>}
          renderItem={({ item }) => (
            <View style={[styles.card, item.status === 'taken' && styles.cardTaken]}>
              <View style={[styles.colorBar, { backgroundColor: item.medication.color }]} />
              <View style={styles.cardBody}>
                <Text style={styles.medName}>{item.medication.name}</Text>
                <Text style={styles.medDosage}>{item.medication.dosage} {item.medication.unit}</Text>
                <Text style={styles.medTime}>{item.dose_schedule.time}</Text>
              </View>
              {item.status !== 'taken' && (
                <TouchableOpacity
                  style={styles.takeButton}
                  onPress={() => markDose.mutate(item)}
                >
                  <Text style={styles.takeButtonText}>Tomei</Text>
                </TouchableOpacity>
              )}
              {item.status === 'taken' && <Text style={styles.takenBadge}>✓ Tomado</Text>}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#6366f1', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  date: { color: '#c7d2fe', fontSize: 14 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 4 },
  profileList: { marginTop: 16 },
  profileChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  profileChipActive: { backgroundColor: '#fff' },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTaken: { opacity: 0.6 },
  colorBar: { width: 6, alignSelf: 'stretch' },
  cardBody: { flex: 1, padding: 16 },
  medName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  medDosage: { fontSize: 14, color: '#64748b', marginTop: 2 },
  medTime: { fontSize: 13, color: '#6366f1', marginTop: 4, fontWeight: '500' },
  takeButton: {
    backgroundColor: '#6366f1',
    margin: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  takeButtonText: { color: '#fff', fontWeight: '600' },
  takenBadge: { color: '#22c55e', fontWeight: '700', marginRight: 16 },
});

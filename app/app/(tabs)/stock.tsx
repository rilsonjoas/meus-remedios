import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProfileStore } from '../../store/profileStore';
import { getMedications, updateStock, Medication } from '../../services/medications';

export default function StockScreen() {
  const { activeProfile } = useProfileStore();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<number | null>(null);
  const [qty, setQty] = useState('');

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ['medications', activeProfile?.id],
    queryFn: () => getMedications(activeProfile!.id),
    enabled: !!activeProfile,
  });

  const mutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateStock(id, { current_quantity: quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      setEditing(null);
    },
  });

  function saveQty(med: Medication) {
    const quantity = parseFloat(qty);
    if (isNaN(quantity) || quantity < 0) {
      Alert.alert('Valor inválido');
      return;
    }
    mutation.mutate({ id: med.id, quantity });
  }

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
          renderItem={({ item }) => {
            const stock = item.stock;
            const isLow = stock && stock.current_quantity <= stock.min_alert_quantity;
            return (
              <View style={[styles.card, isLow && styles.cardAlert]}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  {isLow && <Text style={styles.alertText}>⚠️ Estoque baixo</Text>}
                  {editing === item.id ? (
                    <View style={styles.editRow}>
                      <TextInput
                        style={styles.input}
                        value={qty}
                        onChangeText={setQty}
                        keyboardType="decimal-pad"
                        placeholder="Qtd"
                      />
                      <Text style={styles.unit}>{stock?.unit}</Text>
                      <TouchableOpacity onPress={() => saveQty(item)} style={styles.saveBtn}>
                        <Text style={styles.saveBtnText}>Salvar</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.qty}>
                      {stock?.current_quantity ?? 0} {stock?.unit ?? 'unid'}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setEditing(item.id);
                    setQty(String(stock?.current_quantity ?? 0));
                  }}
                >
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
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
  cardAlert: { borderWidth: 1.5, borderColor: '#fbbf24' },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginRight: 14 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  alertText: { fontSize: 13, color: '#f59e0b', marginTop: 2 },
  qty: { fontSize: 15, color: '#6366f1', fontWeight: '600', marginTop: 4 },
  editRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 80,
    fontSize: 15,
  },
  unit: { color: '#64748b', fontSize: 14 },
  saveBtn: { backgroundColor: '#6366f1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  editIcon: { fontSize: 20, marginLeft: 8 },
});

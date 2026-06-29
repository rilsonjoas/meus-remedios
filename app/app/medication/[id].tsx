import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProfileStore } from '../../store/profileStore';
import {
  createMedication,
  updateMedication,
  createSchedule,
  getMedications,
} from '../../services/medications';
import { scheduleScheduleNotifications } from '../../services/notifications';
import { useTheme } from '../../hooks/useTheme';
import { ThemeColors } from '../../constants/theme';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];

export default function MedicationFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const router = useRouter();
  const queryClient = useQueryClient();
  const { activeProfile } = useProfileStore();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('mg');
  const [color, setColor] = useState('#6366f1');
  const [instructions, setInstructions] = useState('');
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew && activeProfile) {
      getMedications(activeProfile.id).then((meds) => {
        const med = meds.find((m) => m.id === Number(id));
        if (med) {
          setName(med.name);
          setDosage(med.dosage);
          setUnit(med.unit);
          setColor(med.color);
          setInstructions(med.instructions ?? '');
        }
        setLoading(false);
      });
    }
  }, [id]);

  async function save() {
    if (!name.trim() || !dosage.trim()) {
      Alert.alert('Preencha o nome e a dosagem.');
      return;
    }
    if (!activeProfile) return;
    setSaving(true);
    try {
      if (isNew) {
        const med = await createMedication(activeProfile.id, { name, dosage, unit, color, instructions });
        if (scheduleTime) {
          const schedule = await createSchedule(med.id, { time: scheduleTime, days_of_week: [0, 1, 2, 3, 4, 5, 6] });
          await scheduleScheduleNotifications({
            scheduleId: schedule.id,
            time: scheduleTime,
            days_of_week: null,
            medicationName: name,
            dosage,
            unit,
          });
        }
      } else {
        await updateMedication(Number(id), { name, dosage, unit, color, instructions });
      }
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      router.back();
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message ?? 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.brand} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Nome do medicamento *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Losartana"
        placeholderTextColor={colors.textMuted}
        color={colors.text}
      />

      <Text style={styles.label}>Dosagem *</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={dosage}
          onChangeText={setDosage}
          placeholder="50"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          color={colors.text}
        />
        <TextInput
          style={[styles.input, styles.unitInput]}
          value={unit}
          onChangeText={setUnit}
          placeholder="mg"
          placeholderTextColor={colors.textMuted}
          color={colors.text}
        />
      </View>

      <Text style={styles.label}>Cor</Text>
      <View style={styles.colorRow}>
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.colorBtn, { backgroundColor: c }, color === c && styles.colorBtnActive]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      {isNew && (
        <>
          <Text style={styles.label}>Primeiro horário</Text>
          <TextInput
            style={styles.input}
            value={scheduleTime}
            onChangeText={setScheduleTime}
            placeholder="08:00"
            placeholderTextColor={colors.textMuted}
            color={colors.text}
          />
        </>
      )}

      <Text style={styles.label}>Instruções de uso</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={instructions}
        onChangeText={setInstructions}
        placeholder="Ex: Tomar com água, em jejum..."
        placeholderTextColor={colors.textMuted}
        multiline
        numberOfLines={3}
        color={colors.text}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>{isNew ? 'Adicionar' : 'Salvar'}</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    inner: { padding: 20, paddingBottom: 48 },
    label: { fontSize: 14, fontWeight: '600', color: c.textSecondary, marginBottom: 6, marginTop: 16 },
    input: {
      backgroundColor: c.surface, borderWidth: 1, borderColor: c.border,
      borderRadius: 12, padding: 14, fontSize: 16,
    },
    unitInput: { width: 80, marginLeft: 8 },
    row: { flexDirection: 'row', alignItems: 'center' },
    colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
    colorBtn: { width: 32, height: 32, borderRadius: 16 },
    colorBtnActive: { borderWidth: 3, borderColor: c.text, transform: [{ scale: 1.15 }] },
    textarea: { height: 90, textAlignVertical: 'top' },
    saveBtn: {
      backgroundColor: c.brand, borderRadius: 14, padding: 18,
      alignItems: 'center', marginTop: 32,
    },
    saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  });
}

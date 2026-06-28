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
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore, Profile } from '../../store/profileStore';
import { logout } from '../../services/auth';
import { api } from '../../services/api';

const EMOJIS = ['👤', '👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧓', '👴', '👵'];
const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

export default function ProfileScreen() {
  const { user, setUser } = useAuthStore();
  const { profiles, activeProfile, setProfiles, setActiveProfile } = useProfileStore();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('👤');
  const [color, setColor] = useState('#6366f1');
  const [saving, setSaving] = useState(false);

  async function createProfile() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post('/profiles', { name, avatar_emoji: emoji, color });
      setProfiles([...profiles, data]);
      setCreating(false);
      setName('');
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message ?? 'Erro ao criar perfil.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    queryClient.clear();
    setUser(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.userCard}>
        <Text style={styles.avatar}>{user?.avatar_url ? '🧑' : '👤'}</Text>
        <View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={[styles.tier, user?.subscription_tier === 'pro' && styles.tierPro]}>
            {user?.subscription_tier === 'pro' ? '⭐ Pro' : '🆓 Plano Gratuito'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Perfis de Paciente</Text>

      <FlatList
        data={profiles}
        keyExtractor={(p) => String(p.id)}
        style={styles.profileList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.profileRow, activeProfile?.id === item.id && styles.profileRowActive]}
            onPress={() => setActiveProfile(item)}
          >
            <Text style={styles.profileEmoji}>{item.avatar_emoji}</Text>
            <Text style={styles.profileName}>{item.name}</Text>
            {activeProfile?.id === item.id && <Text style={styles.activeCheck}>✓</Text>}
          </TouchableOpacity>
        )}
      />

      {creating ? (
        <View style={styles.createBox}>
          <TextInput
            style={styles.input}
            placeholder="Nome do perfil"
            value={name}
            onChangeText={setName}
          />
          <FlatList
            data={EMOJIS}
            horizontal
            keyExtractor={(e) => e}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setEmoji(item)} style={[styles.emojiBtn, emoji === item && styles.emojiBtnActive]}>
                <Text style={{ fontSize: 22 }}>{item}</Text>
              </TouchableOpacity>
            )}
            style={{ marginBottom: 12 }}
          />
          <FlatList
            data={COLORS}
            horizontal
            keyExtractor={(c) => c}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setColor(item)}
                style={[styles.colorBtn, { backgroundColor: item }, color === item && styles.colorBtnActive]}
              />
            )}
            style={{ marginBottom: 12 }}
          />
          <View style={styles.createActions}>
            <TouchableOpacity onPress={() => setCreating(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={createProfile} style={styles.saveBtn} disabled={saving}>
              <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.addBtn} onPress={() => setCreating(true)}>
          <Text style={styles.addBtnText}>+ Novo Perfil</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  userCard: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatar: { fontSize: 48 },
  userName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  userEmail: { fontSize: 14, color: '#c7d2fe', marginTop: 2 },
  tier: { fontSize: 13, color: '#a5b4fc', marginTop: 4 },
  tierPro: { color: '#fbbf24' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  profileList: { maxHeight: 240, marginBottom: 12 },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  profileRowActive: { borderWidth: 2, borderColor: '#6366f1' },
  profileEmoji: { fontSize: 24, marginRight: 12 },
  profileName: { flex: 1, fontSize: 16, color: '#1e293b', fontWeight: '500' },
  activeCheck: { color: '#6366f1', fontWeight: '700', fontSize: 18 },
  createBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  emojiBtn: { padding: 6, marginRight: 6, borderRadius: 8 },
  emojiBtnActive: { backgroundColor: '#e0e7ff' },
  colorBtn: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  colorBtnActive: { borderWidth: 3, borderColor: '#1e293b' },
  createActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  cancelText: { color: '#64748b', fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: '#6366f1', padding: 12, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  addBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  addBtnText: { color: '#6366f1', fontWeight: '600', fontSize: 15 },
  logoutBtn: { padding: 14, alignItems: 'center' },
  logoutText: { color: '#ef4444', fontWeight: '600', fontSize: 15 },
});

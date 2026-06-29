import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { logout } from '../../services/auth';
import { api } from '../../services/api';

const AVATAR_ICONS: Array<React.ComponentProps<typeof MaterialCommunityIcons>['name']> = [
  'account', 'account-outline', 'account-tie', 'account-heart',
  'face-man', 'face-woman', 'baby-face-outline', 'human',
  'human-male', 'human-female', 'human-child', 'human-greeting',
];
const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];

export default function ProfileScreen() {
  const { user, setUser } = useAuthStore();
  const { profiles, activeProfile, setProfiles, setActiveProfile } = useProfileStore();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [avatarIcon, setAvatarIcon] = useState<React.ComponentProps<typeof MaterialCommunityIcons>['name']>('account');
  const [color, setColor] = useState('#6366f1');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/profiles').then(({ data }) => setProfiles(data));
  }, []);

  async function createProfile() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post('/profiles', { name, avatar_emoji: avatarIcon, color });
      setProfiles([...profiles, data]);
      setCreating(false);
      setName('');
      setAvatarIcon('account');
      setColor('#6366f1');
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message ?? 'Erro ao criar perfil.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          queryClient.clear();
          setUser(null);
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* Card do usuário */}
      <View style={styles.userCard}>
        <View style={styles.userAvatarBox}>
          <MaterialCommunityIcons name="account-circle" size={52} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.tierBadge}>
            <MaterialCommunityIcons
              name={user?.subscription_tier === 'pro' ? 'star' : 'account-outline'}
              size={13}
              color={user?.subscription_tier === 'pro' ? '#fbbf24' : '#a5b4fc'}
            />
            <Text style={[styles.tierText, user?.subscription_tier === 'pro' && styles.tierPro]}>
              {user?.subscription_tier === 'pro' ? 'Pro' : 'Plano Gratuito'}
            </Text>
          </View>
        </View>
      </View>

      {/* Perfis */}
      <Text style={styles.sectionTitle}>Perfis de Paciente</Text>

      {profiles.length === 0 && !creating && (
        <View style={styles.emptyBox}>
          <MaterialCommunityIcons name="account-multiple-plus-outline" size={40} color="#cbd5e1" />
          <Text style={styles.emptyText}>Nenhum perfil ainda.</Text>
          <Text style={styles.emptySubText}>Crie um perfil para começar a gerenciar medicamentos.</Text>
        </View>
      )}

      {profiles.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.profileRow, activeProfile?.id === item.id && styles.profileRowActive]}
          onPress={() => setActiveProfile(item)}
        >
          <View style={[styles.profileIconBox, { backgroundColor: item.color }]}>
            <MaterialCommunityIcons
              name={(item.avatar_emoji as any) ?? 'account'}
              size={22}
              color="#fff"
            />
          </View>
          <Text style={styles.profileName}>{item.name}</Text>
          {activeProfile?.id === item.id && (
            <MaterialCommunityIcons name="check-circle" size={22} color="#6366f1" />
          )}
        </TouchableOpacity>
      ))}

      {/* Formulário de novo perfil */}
      {creating ? (
        <View style={styles.createBox}>
          <Text style={styles.createTitle}>Novo perfil</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do paciente"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
            color="#1e293b"
          />

          <Text style={styles.createLabel}>Ícone</Text>
          <FlatList
            data={AVATAR_ICONS}
            horizontal
            keyExtractor={(e) => e}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setAvatarIcon(item)}
                style={[styles.iconBtn, avatarIcon === item && { backgroundColor: color }]}
              >
                <MaterialCommunityIcons
                  name={item}
                  size={24}
                  color={avatarIcon === item ? '#fff' : '#64748b'}
                />
              </TouchableOpacity>
            )}
            style={styles.iconRow}
          />

          <Text style={styles.createLabel}>Cor</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[styles.colorBtn, { backgroundColor: c }, color === c && styles.colorBtnActive]}
              />
            ))}
          </View>

          <View style={styles.createActions}>
            <TouchableOpacity onPress={() => setCreating(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={createProfile} style={styles.saveBtn} disabled={saving}>
              <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : 'Criar perfil'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.addBtn} onPress={() => setCreating(true)}>
          <MaterialCommunityIcons name="plus" size={20} color="#6366f1" />
          <Text style={styles.addBtnText}>Novo Perfil</Text>
        </TouchableOpacity>
      )}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={18} color="#ef4444" />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  inner: { padding: 16, paddingBottom: 48 },
  userCard: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
  },
  userAvatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  userEmail: { fontSize: 13, color: '#c7d2fe', marginTop: 2 },
  tierBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  tierText: { fontSize: 12, color: '#a5b4fc', fontWeight: '600' },
  tierPro: { color: '#fbbf24' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  emptyBox: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#94a3b8' },
  emptySubText: { fontSize: 13, color: '#cbd5e1', textAlign: 'center' },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  profileRowActive: { borderWidth: 2, borderColor: '#6366f1' },
  profileIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { flex: 1, fontSize: 15, color: '#1e293b', fontWeight: '600' },
  createBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12 },
  createTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 14 },
  createLabel: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 4,
  },
  iconRow: { marginBottom: 4 },
  iconBtn: {
    padding: 8,
    marginRight: 6,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  colorBtn: { width: 30, height: 30, borderRadius: 15 },
  colorBtnActive: { borderWidth: 3, borderColor: '#1e293b', transform: [{ scale: 1.15 }] },
  createActions: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, padding: 13, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  cancelText: { color: '#64748b', fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: '#6366f1', padding: 13, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  addBtnText: { color: '#6366f1', fontWeight: '600', fontSize: 15 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 14,
  },
  logoutText: { color: '#ef4444', fontWeight: '600', fontSize: 15 },
});

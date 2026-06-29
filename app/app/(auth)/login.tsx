import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { login } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { ThemeColors } from '../../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    try {
      const user = await login(email, password);
      setUser(user);
    } catch {
      Alert.alert('Erro', 'Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.inner}>
        <View style={styles.logoBox}>
          <MaterialCommunityIcons name="pill" size={48} color={colors.brand} />
        </View>
        <Text style={styles.title}>Meus Remédios</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          color={colors.text}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          color={colors.text}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <Link href="/(auth)/register" style={styles.link}>
          Não tem conta? Cadastre-se
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
    logoBox: { alignItems: 'center', marginBottom: 12 },
    title: { fontSize: 28, fontWeight: '700', textAlign: 'center', color: c.text },
    subtitle: { fontSize: 16, textAlign: 'center', color: c.textSecondary, marginBottom: 32 },
    input: {
      backgroundColor: c.surface, borderWidth: 1, borderColor: c.border,
      borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 12,
    },
    button: {
      backgroundColor: c.brand, borderRadius: 12, padding: 16,
      alignItems: 'center', marginTop: 8, marginBottom: 16,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    link: { textAlign: 'center', color: c.brand, fontSize: 15 },
  });
}

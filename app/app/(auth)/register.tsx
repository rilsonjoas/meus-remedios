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
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { register } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { ThemeColors } from '../../constants/theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  async function handleRegister() {
    if (!name || !email || !password || !passwordConfirmation) return;
    if (password !== passwordConfirmation) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const user = await register(name, email, password, passwordConfirmation);
      setUser(user);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Erro ao criar conta.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <View style={styles.logoBox}>
          <MaterialCommunityIcons name="pill" size={48} color={colors.brand} />
        </View>
        <Text style={styles.title}>Criar conta</Text>

        <TextInput style={styles.input} placeholder="Nome" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} color={colors.text} />
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
        <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry color={colors.text} />
        <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor={colors.textMuted} value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry color={colors.text} />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Criar conta</Text>}
        </TouchableOpacity>

        <Link href="/(auth)/login" style={styles.link}>
          Já tem conta? Entrar
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    inner: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },
    logoBox: { alignItems: 'center', marginBottom: 12 },
    title: { fontSize: 28, fontWeight: '700', textAlign: 'center', color: c.text, marginBottom: 32 },
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

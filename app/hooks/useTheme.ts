import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { lightColors, darkColors, ThemeColors } from '../constants/theme';

export function useTheme(): { isDark: boolean; colors: ThemeColors } {
  const systemScheme = useColorScheme();
  const { mode } = useThemeStore();

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
  };
}

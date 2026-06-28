# Meus Remédios — Contexto para Claude

## O que é este projeto

App mobile de gestão de medicamentos para pacientes crônicos. Objetivo é viral/produto de massa — não uso pessoal. Modelo freemium com AdMob + assinatura Pro (RevenueCat). Implementação do tier Pro está adiada; focar no MVP funcional primeiro.

## Stack definida (não mudar sem perguntar)

- **Mobile**: Expo (React Native) + TypeScript — `app/`
- **Backend**: Laravel 13 + MySQL — `api/`
- **Auth**: Sanctum (tokens) + Socialite (Google OAuth)
- **Dev backend**: Laravel Sail (Docker)
- **Notificações locais**: expo-notifications + expo-task-manager
- **Offline**: expo-sqlite + AsyncStorage
- **Estado**: Zustand
- **HTTP**: Axios
- **Ads**: react-native-google-mobile-ads (AdMob — não AdSense)
- **IAP**: react-native-purchases (RevenueCat) — adiado

## Decisões importantes

- **Sem Firebase**: substituído por Laravel completo
- **AdMob, não AdSense**: AdSense é para web, AdMob é para mobile
- **RevenueCat**: padrão cross-platform para IAP (App Store + Play Store)
- **Tier Pro adiado**: deixar toda lógica de subscription/limite para versão futura
- **Testes**: Expo Go no celular via QR (sem emulador, sem Android Studio)
- **Deploy backend**: Railway/Render para MVP, escala depois

## O que já foi instalado

Ver README.md para lista completa de pacotes instalados.

## Próximo passo ao retomar

Criar as migrations do Laravel na seguinte ordem:
1. Alterar `users` table (google_id, subscription_tier, avatar_url)
2. `profiles`
3. `medications`
4. `dose_schedules`
5. `dose_logs`
6. `stock_items`

Depois: Models → Controllers → Routes → Expo screens.

## Restrições do ambiente

- Fedora Linux
- Docker instalado (usado para rodar Laravel Sail)
- Node.js v22 instalado
- PHP/Composer NÃO instalados localmente — usar sempre via Docker:
  `docker run --rm --user $(id -u):$(id -g) -v "$(pwd)":/opt -w /opt laravelsail/php84-composer:latest <comando>`
- Arquivos criados pelo Docker ficam como root — usar `--user $(id -u):$(id -g)` para evitar

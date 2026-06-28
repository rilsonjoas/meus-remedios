# Meus Remédios

Gestão de medicamentos e estoque de farmácia caseira para pacientes crônicos — com controle rigoroso de doses, alarmes confiáveis e histórico de adesão ao tratamento.

---

## Visão do Produto

App mobile multiplataforma (Android + iOS) voltado para o mercado em massa. Pacientes crônicos e suas famílias gerenciam medicamentos, doses e estoque. Modelo freemium com anúncios (AdMob) e assinatura Pro via RevenueCat (implementação do tier Pro adiada para versão futura).

---

## Stack

| Camada | Tecnologia |
|---|---|
| App mobile | Expo (React Native) + TypeScript |
| Backend API | Laravel 13 (PHP 8.4) |
| Banco de dados | MySQL (via Docker / Laravel Sail) |
| Autenticação | Laravel Sanctum + Google OAuth (Socialite) |
| Notificações | expo-notifications + expo-task-manager |
| Storage local (offline) | expo-sqlite + AsyncStorage |
| Estado global | Zustand |
| Cache de dados | TanStack React Query |
| HTTP client | Axios |
| Anúncios | Google AdMob (react-native-google-mobile-ads) |
| Assinaturas | RevenueCat (react-native-purchases) — pendente |
| Dev backend | Laravel Sail (Docker) |
| Build mobile | EAS Build (Expo cloud) |

---

## Estrutura de Pastas

```
meus-remedios/
├── app/          # Projeto Expo (React Native)
└── api/          # Projeto Laravel (backend REST API)
```

---

## O que já foi feito

- [x] Projeto Expo scaffoldado com template TypeScript
- [x] Projeto Laravel 13 scaffoldado
- [x] Laravel Sail configurado (docker-compose com MySQL)
- [x] Laravel Sanctum instalado e publicado
- [x] Laravel Socialite instalado (Google OAuth)
- [x] Pacotes Expo instalados:
  - expo-router (navegação)
  - expo-notifications + expo-task-manager + expo-background-fetch (alarmes)
  - expo-sqlite + AsyncStorage (offline-first)
  - expo-secure-store (token seguro)
  - expo-auth-session + expo-web-browser (Google OAuth)
  - axios, zustand, @tanstack/react-query, date-fns
  - react-native-google-mobile-ads (AdMob)
  - react-native-purchases (RevenueCat)

---

## O que está pendente

### Backend (Laravel — `api/`)

- [ ] Atualizar migration de `users` (adicionar `google_id`, `subscription_tier`, `avatar_url`)
- [ ] Migration: `profiles` (perfis de paciente por conta)
- [ ] Migration: `medications` (medicamentos por perfil)
- [ ] Migration: `dose_schedules` (horários de dose)
- [ ] Migration: `dose_logs` (histórico de adesão)
- [ ] Migration: `stock_items` (estoque por medicamento)
- [ ] Model: `User` (atualizado)
- [ ] Model: `Profile`
- [ ] Model: `Medication`
- [ ] Model: `DoseSchedule`
- [ ] Model: `DoseLog`
- [ ] Model: `StockItem`
- [ ] Controller: `AuthController` (register, login, logout, google, me)
- [ ] Controller: `ProfileController` (CRUD)
- [ ] Controller: `MedicationController` (CRUD)
- [ ] Controller: `DoseScheduleController` (CRUD)
- [ ] Controller: `DoseLogController` (index, store, today, history)
- [ ] Controller: `StockController` (show, update)
- [ ] Configurar `routes/api.php`
- [ ] Configurar `config/services.php` para Google OAuth
- [ ] Configurar CORS para o app mobile

### App mobile (Expo — `app/`)

- [ ] Configurar `app.json` (slug, bundle ID, permissões)
- [ ] Configurar Expo Router (`app/_layout.tsx`)
- [ ] Tela: Login / Cadastro (email + Google)
- [ ] Tela: Home — doses de hoje por perfil
- [ ] Tela: Lista de medicamentos
- [ ] Tela: Adicionar / Editar medicamento
- [ ] Tela: Histórico de adesão
- [ ] Tela: Estoque
- [ ] Tela: Gerenciar perfis
- [ ] Serviço: `api.ts` (instância Axios configurada)
- [ ] Store: `authStore.ts` (Zustand — usuário, token)
- [ ] Store: `profileStore.ts` (perfil ativo)
- [ ] Hook: `useNotifications.ts` (agendar/cancelar alarmes)
- [ ] Hook: `useSync.ts` (sincronizar com API quando online)
- [ ] Integração AdMob (banners em telas Free)
- [ ] Integração RevenueCat (assinatura Pro) — adiado para versão futura

---

## Modelo de Dados (planejado)

```
users
  id, name, email, password, google_id, avatar_url,
  subscription_tier (free|pro), subscription_expires_at, timestamps

profiles
  id, user_id, name, color, avatar_emoji, timestamps

medications
  id, profile_id, name, dosage, unit, color, instructions, notes, timestamps

dose_schedules
  id, medication_id, time, days_of_week (JSON), interval_hours, is_active, timestamps

dose_logs
  id, dose_schedule_id, medication_id, profile_id,
  scheduled_at, taken_at, status (taken|skipped|missed), notes, timestamps

stock_items
  id, medication_id, current_quantity, unit, min_alert_quantity, timestamps
```

---

## Como rodar localmente

### Backend

```bash
cd api
./vendor/bin/sail up -d        # sobe MySQL + PHP via Docker
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan serve  # API em http://localhost:80
```

> Primeira vez: copiar `.env.example` para `.env` e configurar `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.

### App mobile

```bash
cd app
npx expo start                  # abre o QR code
# Escanear com o app Expo Go no celular (mesma rede Wi-Fi)
```

---

## Roadmap futuro

- Tier Pro (perfis ilimitados, histórico completo, sem anúncios, exportação)
- Integração RevenueCat para compras in-app
- Notificações push via Expo Push Notification Service
- Relatórios de adesão (PDF)
- Integração com farmácias para reposição de estoque
- Suporte a múltiplos idiomas

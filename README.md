# Meus Remédios

Gestão de medicamentos e estoque de farmácia caseira para pacientes crônicos — com controle rigoroso de doses, alarmes confiáveis e histórico de adesão ao tratamento.

Produto de massa (app viral), modelo freemium com AdMob + assinatura Pro.

---

## Stack

| Camada | Tecnologia |
|---|---|
| App mobile | Expo SDK 56 (React Native) + TypeScript |
| Navegação | Expo Router (file-based) |
| Backend API | Laravel 13 (PHP 8.4) |
| Banco de dados | MySQL 8.4 (via Docker / Laravel Sail) |
| Autenticação | Laravel Sanctum + Google OAuth (Socialite) |
| Notificações | expo-notifications + expo-task-manager |
| Storage offline | expo-sqlite + AsyncStorage |
| Estado global | Zustand |
| Cache de dados | TanStack React Query |
| HTTP client | Axios |
| Ícones | lucide-react-native |
| Anúncios | Google AdMob — **pendente** |
| Assinaturas | RevenueCat — **pendente** |
| Dev backend | Laravel Sail (Docker) |
| Build mobile | EAS Build (Expo cloud) |

---

## Estrutura

```
meus-remedios/
├── app/                        # Expo (React Native)
│   ├── app/
│   │   ├── _layout.tsx         # Root layout + auth guard
│   │   ├── (auth)/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── (tabs)/
│   │   │   ├── index.tsx       # Hoje — doses do dia
│   │   │   ├── medications.tsx # Lista de medicamentos
│   │   │   ├── history.tsx     # Histórico de adesão
│   │   │   ├── stock.tsx       # Controle de estoque
│   │   │   └── profile.tsx     # Perfis e conta
│   │   └── medication/[id].tsx # Adicionar / Editar medicamento
│   ├── services/               # Chamadas à API
│   │   ├── api.ts              # Instância Axios
│   │   ├── auth.ts
│   │   ├── medications.ts
│   │   └── doses.ts
│   └── store/                  # Estado global (Zustand)
│       ├── authStore.ts
│       └── profileStore.ts
└── api/                        # Laravel
    ├── app/Http/Controllers/   # AuthController, ProfileController...
    ├── app/Models/             # User, Profile, Medication...
    ├── database/migrations/    # Schema completo
    └── routes/api.php          # Todas as rotas REST
```

---

## Modelo de dados

```
users           → profiles → medications → dose_schedules → dose_logs
                                        ↘ stock_items
```

---

## O que está funcionando

- [x] Cadastro e login (email/senha)
- [x] Auth guard automático (redireciona p/ login se não autenticado)
- [x] API REST completa (auth, perfis, medicamentos, horários, doses, estoque)
- [x] Validação em português (pt_BR)
- [x] Estrutura de telas com tabs (Hoje, Remédios, Histórico, Estoque, Perfis)
- [x] Ícones Lucide em toda navegação
- [x] Monorepo no GitHub

---

## Próximos passos

### Alta prioridade (MVP funcional)
- [ ] Tela "Hoje" — buscar perfis da API ao entrar (hoje usa dados mock)
- [ ] Tela "Hoje" — exibir doses sem perfil selecionado (onboarding)
- [ ] Tela "Perfis" — criar primeiro perfil após cadastro (fluxo guiado)
- [ ] Tela "Remédios" — adicionar medicamento e testar fluxo completo
- [ ] Notificações locais — agendar alarme ao criar horário de dose
- [ ] Sincronização offline → online (fila de dose_logs locais)

### Média prioridade
- [ ] Google OAuth (botão "Entrar com Google" nas telas de auth)
- [ ] Tela de histórico com filtro por data e medicamento
- [ ] Alerta de estoque baixo na tela de estoque
- [ ] Exportação de histórico em PDF (Pro)

### Baixa prioridade / futuro
- [ ] Google AdMob (banners em telas do plano Free)
- [ ] RevenueCat + assinatura Pro (perfis e medicamentos ilimitados, sem anúncios)
- [ ] Notificações push (Expo Push Notification Service)
- [ ] Deploy do backend (Railway ou VPS)
- [ ] Publicar na Play Store e App Store

---

## Como rodar localmente

### Backend

```bash
cd api
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
# API em http://192.168.18.4 (porta 80)
```

### App mobile

```bash
cd app
npx expo start --clear
# Escanear QR com Expo Go (celular na mesma rede Wi-Fi)
# ou: eas build --platform android --profile development
```

> Atualizar `app/.env` com o IP local do PC se mudar de rede.

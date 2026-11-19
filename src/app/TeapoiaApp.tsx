'use client'

import Image from 'next/image'

import { useEffect, useState } from 'react'
import {
  Apple,
  ArrowLeft,
  BookOpen,
  Camera,
  Check,
  ChevronRight,
  CircleAlert,
  CircleUserRound,
  Copy,
  Download,
  Ear,
  ExternalLink,
  Eye,
  EyeOff,
  Frown,
  Hand,
  HeartHandshake,
  House,
  Lightbulb,
  LocateFixed,
  KeyRound,
  Mail,
  MapPin,
  MapPinHouse,
  Meh,
  MessageCircle,
  MessagesSquare,
  Moon,
  Music2,
  Pause,
  Pencil,
  Phone,
  Play,
  Plus,
  RotateCw,
  Search,
  SlidersHorizontal,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  TriangleAlert,
  User,
  Volume2,
  Wind,
  WifiOff,
  X,
  LogOut,
  Coffee,
  TreePine,
  Sofa,
} from 'lucide-react'
const logoImage = '/teapoia-logo.png'

const storage = {
  getItem(key: string) {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key)
  },
  setItem(key: string, value: string) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value)
      window.dispatchEvent(new CustomEvent('teapoia:storage-change', { detail: { key } }))
    }
  },
  removeItem(key: string) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
      window.dispatchEvent(new CustomEvent('teapoia:storage-change', { detail: { key } }))
    }
  },
}

type AuthResult = {
  ok: boolean
  message?: string
  resetToken?: string
  user?: {
    id: string | number
    email: string
    name?: string
    preferredName?: string
    phone?: string
    photo?: string
  }
}

// DEMONSTRAÇÃO FRONTEND: autenticação simulada, sem servidor ou banco de dados.
async function authRequest(path: string, data?: Record<string, unknown>): Promise<AuthResult> {
  const profile = readStoredJSON<AuthResult['user'] | null>('teapoia-demo-user', null)
  if (path === 'me') return profile ? { ok: true, user: profile } : { ok: false }
  if (path === 'logout') {
    storage.removeItem('teapoia-demo-user')
    return { ok: true }
  }
  if (path === 'login') {
    const email = String(data?.email || '')
    const user = {
      id: 'demo-user',
      email,
      name: email.split('@')[0] || 'Pessoa usuária',
      preferredName: email.split('@')[0] || 'Pessoa usuária',
    }
    storage.setItem('teapoia-demo-user', JSON.stringify(user))
    return { ok: true, user }
  }
  if (path === 'register') return { ok: true, message: 'Cadastro demonstrativo realizado.' }
  if (path === 'verify-email' || path === 'privacy-acknowledgement' ||
      path === 'resend-verification' || path === 'recovery/request' ||
      path === 'recovery/verify' || path === 'recovery/reset') {
    return { ok: true, message: 'Ação simulada para demonstração.' }
  }
  return { ok: true }
}

function readStoredJSON<T>(key: string, fallback: T): T {
  try {
    const value = storage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

type Screen =
  | 'login'
  | 'register'
  | 'emailLogin'
  | 'verifyEmail'
  | 'forgotPassword'
  | 'recoveryCode'
  | 'newPassword'
  | 'home'
  | 'yellow'
  | 'breathing'
  | 'orange'
  | 'moves'
  | 'playlist'
  | 'quiet'
  | 'silent'
  | 'stimuli'
  | 'write'
  | 'saved'
  | 'diary'
  | 'messages'
  | 'support'
  | 'profile'
  | 'profileEdit'
  | 'profileData'
  | 'profileContacts'
  | 'profileCommunication'
  | 'privacy'
  | 'appearance'

type Theme = 'light' | 'dark' | 'reading'
type PermissionKind = 'phone' | 'whatsapp' | 'music' | 'photos' | 'sound' | 'location'
type PermissionRequester = (
  kind: PermissionKind,
  title: string,
  description: string,
) => Promise<boolean>

const quickMessages = [
  'Não consigo falar agora.',
  'Preciso de alguns minutos em silêncio.',
  'Estou em sobrecarga. Você pode ficar comigo?',
]

const movementOptions = [
  'Balançar o corpo suavemente',
  'Balançar as mãos',
  'Balançar os pés ou as pernas',
  'Abrir e fechar as mãos',
  'Tocar o polegar em cada dedo',
  'Contatar/tocar as pontas dos dedos',
  'Esfregar suavemente as pontas dos dedos',
  'Estalar os dedos sem forçar',
  'Girar os punhos suavemente',
  'Caminhar devagar em um espaço seguro',
  'Cantarolar ou fazer sons suaves',
  'Apertar uma almofada ou objeto macio',
]

function Brand({ large = false }: { large?: boolean }) {
  return (
    <div className={`brand ${large ? 'brand-large' : ''}`} aria-label="TEApoia">
      <Image src={logoImage} width={1054} height={866} alt="" aria-hidden="true" priority />
      <span>
        TEA<strong>poia</strong>
      </span>
    </div>
  )
}

function Header({
  onHome,
  onTheme,
  onProfile,
  theme,
  showProfile,
  showBack,
  onBack,
}: {
  onHome: () => void
  onTheme: () => void
  onProfile: () => void
  theme: Theme
  showProfile: boolean
  showBack?: boolean
  onBack?: () => void
}) {
  return (
    <header className="app-header">
      <div className="header-side">
        {showBack && (
          <button className="header-icon subtle" onClick={onBack} aria-label="Voltar">
            <ArrowLeft size={20} />
          </button>
        )}
      </div>
      <button className="brand-button" onClick={onHome}>
        <Brand />
      </button>
      <div className="header-actions">
        <button className="header-icon" onClick={onTheme} aria-label="Mudar aparência">
          {theme === 'light' ? <Moon size={21} /> : <Sun size={21} />}
        </button>
        {showProfile && (
          <button className="header-icon" onClick={onProfile} aria-label="Perfil">
            <CircleUserRound size={21} />
          </button>
        )}
      </div>
    </header>
  )
}

function BottomNav({ screen, go }: { screen: Screen; go: (screen: Screen) => void }) {
  return (
    <nav className="bottom-navigation" aria-label="Navegação principal">
      <button className={screen === 'home' ? 'active' : ''} onClick={() => go('home')}>
        <House />
        <span>Início</span>
      </button>
      <button
        className={screen === 'diary' || screen === 'write' ? 'active' : ''}
        onClick={() => go('diary')}
      >
        <BookOpen />
        <span>Diário</span>
      </button>
      <button className={screen === 'messages' ? 'active' : ''} onClick={() => go('messages')}>
        <MessageCircle />
        <span>Mensagens</span>
      </button>
      <button className={screen === 'support' ? 'active' : ''} onClick={() => go('support')}>
        <HeartHandshake />
        <span>Suporte</span>
      </button>
    </nav>
  )
}

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function PwaStatus() {
  const [online, setOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    setOnline(navigator.onLine)

    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    const handleInstalled = () => setInstallPrompt(null)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      let refreshing = false
      let updateTimer: number | undefined
      let removeOnlineUpdateListener: (() => void) | undefined

      const handleControllerChange = () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      }

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          if (registration.waiting) setWaitingWorker(registration.waiting)

          registration.addEventListener('updatefound', () => {
            const worker = registration.installing
            if (!worker) return
            worker.addEventListener('statechange', () => {
              if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(worker)
              }
            })
          })

          const checkForUpdate = () => {
            if (navigator.onLine) void registration.update()
          }
          window.addEventListener('online', checkForUpdate)
          removeOnlineUpdateListener = () => {
            window.removeEventListener('online', checkForUpdate)
          }
          updateTimer = window.setInterval(checkForUpdate, 60 * 60 * 1000)
        })
        .catch(() => {
          // The app remains fully usable when service workers are unavailable.
        })

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
        window.removeEventListener('appinstalled', handleInstalled)
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
        removeOnlineUpdateListener?.()
        window.clearInterval(updateTimer)
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  async function installApp() {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  if (!online) {
    return (
      <aside className="pwa-status pwa-status-offline" role="status">
        <WifiOff size={18} aria-hidden="true" />
        <span>
          <strong>Você está sem internet.</strong>
          Recursos e dados salvos continuam disponíveis.
        </span>
      </aside>
    )
  }

  if (waitingWorker) {
    return (
      <aside className="pwa-status" role="status">
        <RotateCw size={18} aria-hidden="true" />
        <span>
          <strong>Atualização disponível.</strong>
          Seus dados locais serão preservados.
        </span>
        <button onClick={() => waitingWorker.postMessage({ type: 'SKIP_WAITING' })}>
          Atualizar
        </button>
      </aside>
    )
  }

  if (installPrompt) {
    return (
      <aside className="pwa-status" role="status">
        <Download size={18} aria-hidden="true" />
        <span>
          <strong>Instale o TEApoia.</strong>
          Use como aplicativo no seu dispositivo.
        </span>
        <button onClick={installApp}>Instalar</button>
      </aside>
    )
  }

  return null
}

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [splashLeaving, setSplashLeaving] = useState(false)
  const [screen, setScreen] = useState<Screen>('login')
  const [previousScreen, setPreviousScreen] = useState<Screen>('home')
  const [authenticated, setAuthenticated] = useState(false)
  const [hasAppAccess, setHasAppAccess] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')
  const [fontScale, setFontScale] = useState(1)
  const [contrast, setContrast] = useState<'standard' | 'high' | 'soft'>('standard')
  const [toast, setToast] = useState('')
  const [diaryText, setDiaryText] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [pendingPassword, setPendingPassword] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [pendingPrivacyUser, setPendingPrivacyUser] = useState<AuthResult['user'] | null>(null)
  const [permissionRequest, setPermissionRequest] = useState<{
    kind: PermissionKind
    title: string
    description: string
    resolve: (allowed: boolean) => void
  } | null>(null)

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setSplashLeaving(true), 2500)
    const hideTimer = window.setTimeout(() => setShowSplash(false), 3000)
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    if (!authenticated) return
    const sync = () => void syncLocalData()
    let syncTimer: number | undefined
    const queueSync = () => {
      window.clearTimeout(syncTimer)
      syncTimer = window.setTimeout(sync, 800)
    }
    window.addEventListener('online', sync)
    window.addEventListener('teapoia:storage-change', queueSync)
    return () => {
      window.clearTimeout(syncTimer)
      window.removeEventListener('online', sync)
      window.removeEventListener('teapoia:storage-change', queueSync)
    }
  }, [authenticated, theme, fontScale, contrast])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 16}px`
    return () => {
      document.documentElement.style.fontSize = ''
    }
  }, [fontScale])

  useEffect(() => {
    let active = true
    authRequest('me').then((result) => {
      if (!active) return
      if (result.ok && result.user) {
        applyAuthenticatedUser(result.user)
        return
      }
      if (!navigator.onLine && storage.getItem('teapoia-offline-session') === 'available') {
        setAuthenticated(true)
        setHasAppAccess(true)
        setScreen('home')
        setToast('Você está usando os dados salvos neste dispositivo.')
      }
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const email = params.get('verifyEmail')
    const token = params.get('verificationToken')
    if (!email || !token) return

    authRequest('verify-email', { email, token }).then((result) => {
      window.history.replaceState({}, '', '/')
      setPendingEmail(email)
      setScreen('emailLogin')
      setToast(
        result.ok
          ? 'E-mail confirmado. Entre com sua senha para continuar.'
          : result.message || 'Não foi possível confirmar o e-mail.',
      )
    })
  }, [])

  useEffect(() => {
    if (screen === 'diary' && diaryText) {
      const timer = window.setTimeout(() => setDiaryText(''), 0)
      return () => window.clearTimeout(timer)
    }
  }, [screen, diaryText])

  function go(next: Screen) {
    if (next === 'home' && !hasAppAccess) {
      setScreen('login')
      setToast('Entre com seu e-mail ou toque em "Explorar o app" para continuar.')
      return
    }
    if (next === 'diary' && !authenticated) {
      setPreviousScreen(screen)
      setScreen('login')
      setToast('Entre para acessar seu diário.')
      return
    }
    setPreviousScreen(screen)
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function applyAuthenticatedUser(user?: AuthResult['user']) {
    if (user) {
      storage.setItem('teapoia-account-email', user.email)
      storage.setItem(
        'teapoia-profile',
        JSON.stringify({
          name: user.name || '',
          preferredName: user.preferredName || user.name || '',
          email: user.email,
          phone: user.phone || '',
          photo: user.photo || '',
        }),
      )
      storage.setItem('teapoia-offline-session', 'available')
    }
    setAuthenticated(true)
    setHasAppAccess(true)
    setScreen('home')
    setToast('Conta conectada com sucesso.')
    void syncLocalData()
  }

  async function syncLocalData() {
    // Dados mantidos apenas neste navegador (localStorage), sem sincronização remota.
    if (typeof window !== 'undefined') {
      storage.setItem('teapoia-last-local-save', new Date().toISOString())
    }
  }

  async function login(email: string, password: string) {
    const result = await authRequest('login', { email, password })
    if (result.ok && result.user) setPendingPrivacyUser(result.user)
    return result
  }

  async function acceptPrivacyAfterLogin() {
    const result = await authRequest('privacy-acknowledgement', { version: '1.1' })
    if (!result.ok || !pendingPrivacyUser) {
      setToast(result.message || 'Não foi possível registrar sua escolha. Tente novamente.')
      return false
    }
    const user = pendingPrivacyUser
    setPendingPrivacyUser(null)
    applyAuthenticatedUser(user)
    return true
  }

  async function declinePrivacyAfterLogin() {
    await authRequest('logout', {})
    setPendingPrivacyUser(null)
    setPendingPassword('')
    setAuthenticated(false)
    setHasAppAccess(false)
    setScreen('login')
    setToast('A sessão foi encerrada porque o aviso não foi aceito.')
  }

  async function register(data: {
    name: string
    email: string
    password: string
    acceptedPrivacy: boolean
  }) {
    const result = await authRequest('register', data)
    if (result.ok) {
      setPendingEmail(data.email)
      setPendingPassword(data.password)
      setScreen('verifyEmail')
    }
    return result
  }

  function requestPermission(
    kind: PermissionKind,
    title: string,
    description: string,
  ): Promise<boolean> {
    if (storage.getItem(`teapoia-permission-${kind}`) === 'granted') {
      return Promise.resolve(true)
    }
    return new Promise((resolve) => {
      setPermissionRequest({ kind, title, description, resolve })
    })
  }

  function answerPermission(allowed: boolean) {
    if (!permissionRequest) return
    if (allowed) {
      storage.setItem(`teapoia-permission-${permissionRequest.kind}`, 'granted')
    }
    permissionRequest.resolve(allowed)
    setPermissionRequest(null)
  }

  function goBack() {
    const fixedReturns: Partial<Record<Screen, Screen>> = {
      register: 'login',
      emailLogin: 'login',
      verifyEmail: 'register',
      forgotPassword: 'emailLogin',
      recoveryCode: 'forgotPassword',
      newPassword: 'recoveryCode',
      yellow: 'home',
      orange: 'home',
      moves: 'orange',
      quiet: previousScreen,
      silent: 'orange',
      stimuli: 'yellow',
      saved: 'write',
      diary: 'home',
      messages: 'home',
      support: 'home',
      profile: 'home',
      profileEdit: 'profile',
      profileData: 'profile',
      profileCommunication: 'profile',
      privacy: 'profile',
      appearance: previousScreen,
    }
    setScreen(fixedReturns[screen] ?? previousScreen)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const noNavigation =
    !hasAppAccess ||
    [
      'login',
      'register',
      'emailLogin',
      'verifyEmail',
      'forgotPassword',
      'recoveryCode',
      'newPassword',
    ].includes(screen)

  return (
    <div className={`site theme-${theme} contrast-${contrast}`}>
      {showSplash && <Splash leaving={splashLeaving} />}

      <div className="mobile-app" style={{ '--font-scale': fontScale } as React.CSSProperties}>
        <PwaStatus />
        <Header
          theme={theme}
          showProfile={screen !== 'login'}
          onTheme={() => go('appearance')}
          onHome={() => go('home')}
          onProfile={() => (authenticated ? go('profile') : go('login'))}
          showBack={screen !== 'login' && screen !== 'home'}
          onBack={goBack}
        />

        <main className={`screen-content ${noNavigation ? 'without-nav' : ''}`}>
          {screen === 'login' && (
            <LoginScreen
              onSocial={(provider) =>
                setToast(
                  `O acesso com ${provider} ficará disponível após configurar as credenciais do provedor.`,
                )
              }
              onRegister={() => setScreen('register')}
              onEmailLogin={() => setScreen('emailLogin')}
              onForgotPassword={() => setScreen('forgotPassword')}
              onExplore={() => {
                setHasAppAccess(true)
                setScreen('home')
              }}
            />
          )}
          {screen === 'register' && (
            <RegisterScreen onCreate={register} onLogin={() => setScreen('emailLogin')} />
          )}
          {screen === 'emailLogin' && (
            <EmailLoginScreen onLogin={login} onForgot={() => setScreen('forgotPassword')} />
          )}
          {screen === 'verifyEmail' && (
            <VerifyEmailScreen
              email={pendingEmail}
              onConfirm={async () => {
                if (!pendingPassword) {
                  setScreen('emailLogin')
                  setToast('E-mail confirmado? Entre com sua senha para continuar.')
                  return
                }
                const result = await login(pendingEmail, pendingPassword)
                if (!result.ok) {
                  setToast(
                    result.message ||
                      'Seu e-mail ainda não foi confirmado. Abra o link enviado e tente novamente.',
                  )
                }
              }}
              onResend={async () => {
                const result = await authRequest('resend-verification', { email: pendingEmail })
                setToast(
                  result.ok
                    ? 'Se a conta estiver pendente, um novo link será enviado.'
                    : result.message || 'Não foi possível reenviar.',
                )
              }}
            />
          )}
          {screen === 'forgotPassword' && (
            <ForgotPasswordScreen
              onSend={async (email) => {
                const result = await authRequest('recovery/request', { email })
                if (result.ok) {
                  setRecoveryEmail(email)
                  setScreen('recoveryCode')
                }
                return result
              }}
            />
          )}
          {screen === 'recoveryCode' && (
            <RecoveryCodeScreen
              email={recoveryEmail}
              onValidate={async (code) => {
                const result = await authRequest('recovery/verify', {
                  email: recoveryEmail,
                  code,
                })
                if (result.ok && result.resetToken) {
                  setResetToken(result.resetToken)
                  setScreen('newPassword')
                }
                return result
              }}
              onResend={async () => {
                const result = await authRequest('recovery/request', { email: recoveryEmail })
                setToast(
                  result.ok
                    ? 'Se o e-mail estiver cadastrado, um novo código será enviado.'
                    : result.message || 'Não foi possível reenviar.',
                )
              }}
            />
          )}
          {screen === 'newPassword' && (
            <NewPasswordScreen
              onSave={async (password) => {
                const result = await authRequest('recovery/reset', {
                  email: recoveryEmail,
                  resetToken,
                  password,
                })
                if (result.ok) {
                  setScreen('emailLogin')
                  setToast('Senha alterada. Entre com sua nova senha.')
                }
                return result
              }}
            />
          )}
          {screen === 'home' && <HomeScreen go={go} />}
          {screen === 'yellow' && (
            <OptionsScreen variant="yellow" go={go} onDiary={() => go('write')} toast={setToast} />
          )}
          {screen === 'orange' && (
            <OptionsScreen variant="orange" go={go} onDiary={() => go('write')} toast={setToast} />
          )}
          {screen === 'breathing' && <BreathingScreen />}
          {screen === 'moves' && <MovementsScreen toast={setToast} />}
          {screen === 'playlist' && <PlaylistScreen requestPermission={requestPermission} />}
          {screen === 'quiet' && (
            <QuietPlacesScreen toast={setToast} requestPermission={requestPermission} />
          )}
          {screen === 'silent' && (
            <SilentModeScreen toast={setToast} requestPermission={requestPermission} />
          )}
          {screen === 'stimuli' && <ReduceStimuliScreen />}
          {screen === 'write' && (
            <WriteDiaryScreen
              value={diaryText}
              setValue={setDiaryText}
              onSave={() => {
                if (!diaryText.trim()) {
                  setToast('Escreva algo antes de salvar.')
                  return
                }
                setScreen('saved')
              }}
            />
          )}
          {screen === 'saved' && (
            <SavedScreen
              onDiary={() => setScreen('diary')}
              onWrite={() => {
                setDiaryText('')
                setScreen('write')
              }}
            />
          )}
          {screen === 'diary' && <DiaryScreen text={diaryText} onWrite={() => go('write')} />}
          {screen === 'messages' && (
            <MessagesScreen
              authenticated={authenticated}
              onLogin={() => go('login')}
              toast={setToast}
            />
          )}
          {screen === 'support' && (
            <SupportScreen
              authenticated={authenticated}
              onLogin={() => go('login')}
              onManageContacts={() => go('profileContacts')}
              requestPermission={requestPermission}
            />
          )}
          {screen === 'profile' && (
            <ProfileScreen
              go={go}
              onLogout={async () => {
                await authRequest('logout', {})
                storage.removeItem('teapoia-offline-session')
                setAuthenticated(false)
                setHasAppAccess(false)
                setScreen('login')
                setToast('Você saiu da sua conta.')
              }}
            />
          )}
          {screen === 'profileEdit' && (
            <ProfileEditScreen
              requestPermission={requestPermission}
              onSave={() => {
                setScreen('profile')
                setToast('Perfil atualizado.')
              }}
            />
          )}
          {screen === 'profileData' && (
            <ProfileDataScreen
              onRecoverPassword={(email) => {
                setRecoveryEmail(email)
                setScreen('recoveryCode')
                setToast('Enviamos um código de segurança para o seu e-mail.')
              }}
              toast={setToast}
            />
          )}
          {screen === 'profileContacts' && <EmergencyContactsScreen toast={setToast} />}
          {screen === 'profileCommunication' && <CommunicationPreferencesScreen toast={setToast} />}
          {screen === 'privacy' && (
            <PrivacyScreen
              onAccountDeleted={() => {
                storage.removeItem('teapoia-offline-session')
                setAuthenticated(false)
                setHasAppAccess(false)
                setScreen('login')
              }}
              toast={setToast}
            />
          )}
          {screen === 'appearance' && (
            <AppearanceScreen
              theme={theme}
              setTheme={setTheme}
              fontScale={fontScale}
              setFontScale={setFontScale}
              contrast={contrast}
              setContrast={setContrast}
            />
          )}
        </main>

        {!noNavigation && <BottomNav screen={screen} go={go} />}
      </div>

      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}
      {permissionRequest && (
        <PermissionModal
          title={permissionRequest.title}
          description={permissionRequest.description}
          onAllow={() => answerPermission(true)}
          onDeny={() => answerPermission(false)}
        />
      )}
      {pendingPrivacyUser && (
        <PostLoginPrivacyModal
          onAccept={acceptPrivacyAfterLogin}
          onDecline={declinePrivacyAfterLogin}
        />
      )}
    </div>
  )
}

function Splash({ leaving }: { leaving: boolean }) {
  return (
    <div
      className={`splash-screen ${leaving ? 'splash-leaving' : ''}`}
      role="status"
      aria-label="Carregando o TEApoia"
    >
      <div className="splash-content">
        <Image
          className="splash-logo"
          src={logoImage}
          width={1054}
          height={866}
          alt=""
          aria-hidden="true"
          priority
        />
        <div className="splash-name">
          TEA<span>poia</span>
        </div>
        <div className="splash-message">
          <p>Um espaço de apoio para o seu dia a dia.</p>
          <strong>Seu suporte sempre à mão.</strong>
        </div>
      </div>
      <div className="splash-waves" aria-hidden="true">
        <span className="splash-wave splash-wave-lilac" />
        <span className="splash-wave splash-wave-blue" />
        <span className="splash-wave splash-wave-mint" />
        <span className="splash-wave splash-wave-pink" />
      </div>
    </div>
  )
}

function PermissionModal({
  title,
  description,
  onAllow,
  onDeny,
}: {
  title: string
  description: string
  onAllow: () => void
  onDeny: () => void
}) {
  return (
    <div className="permission-backdrop" role="presentation">
      <section
        className="permission-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="permission-title"
      >
        <div className="permission-icon">
          <ShieldCheck />
        </div>
        <h2 id="permission-title">{title}</h2>
        <p>{description}</p>
        <div className="permission-reason">
          <ShieldCheck />
          <span>
            O TEApoia solicitará acesso somente para esta função. Você continua no controle.
          </span>
        </div>
        <button className="primary-button" onClick={onAllow}>
          Permitir acesso
        </button>
        <button className="permission-deny" onClick={onDeny}>
          Agora não
        </button>
      </section>
    </div>
  )
}

function LoginScreen({
  onSocial,
  onRegister,
  onEmailLogin,
  onForgotPassword,
  onExplore,
}: {
  onSocial: (provider: 'Google' | 'Apple') => void
  onRegister: () => void
  onEmailLogin: () => void
  onForgotPassword: () => void
  onExplore: () => void
}) {
  return (
    <section className="login-screen">
      <div className="login-identity">
        <Brand large />
        <p>
          Um espaço de apoio para o seu dia a dia.
          <br />
          Seu suporte sempre à mão.
        </p>
      </div>
      <div className="login-actions">
        <button className="auth-button" onClick={() => onSocial('Google')}>
          <span className="google-mark">G</span>
          Continuar com Google
        </button>
        <button className="auth-button" onClick={() => onSocial('Apple')}>
          <Apple fill="currentColor" />
          Continuar com Apple
        </button>
        <button className="auth-button" onClick={onEmailLogin}>
          <Mail />
          Entrar com e-mail
        </button>
        <div className="divider">
          <span>ou</span>
        </div>
        <button className="primary-button" onClick={onRegister}>
          Criar conta
        </button>
        <button className="soft-button" onClick={onExplore}>
          Explorar o app
        </button>
        <button className="login-recovery-link" onClick={onForgotPassword}>
          <KeyRound />
          Recuperar senha
        </button>
      </div>
      <p className="access-note">
        Você pode explorar o app sem criar conta, mas o cadastro permite salvar suas preferências,
        contatos e registros.
      </p>
    </section>
  )
}

function PrivacyNoticeDialog({
  label = 'Ler o aviso completo de tratamento de dados',
}: {
  label?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <>
      <button className="privacy-notice-link" type="button" onClick={() => setOpen(true)}>
        <ShieldCheck aria-hidden="true" />
        {label}
      </button>
      {open && (
        <div className="privacy-notice-backdrop" role="presentation">
          <article
            className="privacy-notice-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-notice-title"
          >
            <header>
              <span>
                <ShieldCheck aria-hidden="true" />
              </span>
              <div>
                <p>Aviso de Tratamento de Dados • versão 1.1</p>
                <h2 id="privacy-notice-title">Como o TEApoia cuida dos seus dados</h2>
              </div>
              <button
                className="privacy-notice-close"
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar aviso de privacidade"
                autoFocus
              >
                <X />
              </button>
            </header>

            <div className="privacy-notice-content">
              <section className="privacy-notice-intro">
                <strong>Em resumo</strong>
                <p>
                  A LGPD é a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018). Ela
                  garante transparência, segurança e controle sobre o uso de dados pessoais. Ser
                  autista não reduz a autonomia nem os direitos de uma pessoa.
                </p>
              </section>

              <section>
                <h3>Quais dados podem ser tratados</h3>
                <ul>
                  <li>Conta e perfil: nome, e-mail, telefone e foto escolhida.</li>
                  <li>
                    Dados do uso: preferências de acessibilidade, comunicação e estratégias de
                    apoio.
                  </li>
                  <li>Conteúdo privado: diário, mensagens e contatos de suporte.</li>
                  <li>
                    Permissões do dispositivo, como localização, câmera, ligação ou música, somente
                    quando você solicitar o recurso.
                  </li>
                </ul>
                <p>
                  Registros emocionais ou informações que revelem saúde ou diagnóstico podem ser
                  <strong> dados pessoais sensíveis</strong> e recebem proteção reforçada.
                </p>
              </section>

              <section>
                <h3>Para que os dados são usados</h3>
                <p>
                  Para criar e proteger sua conta, salvar os recursos que você escolher, sincronizar
                  seus dados entre acessos, personalizar acessibilidade e executar pedidos como
                  exportação ou exclusão. O TEApoia não usa o diário emocional para publicidade nem
                  vende dados pessoais.
                </p>
              </section>

              <section>
                <h3>Consentimento e tratamentos necessários</h3>
                <p>
                  Marcar o aceite confirma que você recebeu e leu este aviso. Nem todo tratamento
                  depende de consentimento: operações necessárias para manter a conta e prestar o
                  serviço utilizam a base legal adequada. Permissões opcionais são solicitadas
                  separadamente, no momento do uso, e podem ser recusadas ou revogadas.
                </p>
              </section>

              <section>
                <h3>Compartilhamento com serviços externos</h3>
                <p>
                  O compartilhamento ocorre apenas quando necessário ao recurso solicitado, como
                  envio de e-mail, abertura de WhatsApp, ligação, aplicativo de música ou mapa. O
                  TEApoia informa a finalidade antes de pedir uma permissão. Serviços externos
                  possuem regras próprias de privacidade.
                </p>
              </section>

              <section>
                <h3>Proteção em cada etapa da vida</h3>
                <div className="life-stage-grid">
                  <article>
                    <strong>Adultos</strong>
                    <p>
                      Mantêm sua autonomia e decidem sobre conta, dados e rede de apoio. Um
                      diagnóstico não autoriza compartilhamento automático com familiares ou
                      cuidadores.
                    </p>
                  </article>
                  <article>
                    <strong>Adolescentes</strong>
                    <p>
                      O tratamento deve observar o melhor interesse, usar linguagem compreensível e
                      considerar a participação de responsável quando exigida pela lei, sem apagar a
                      voz e a privacidade do adolescente.
                    </p>
                  </article>
                  <article>
                    <strong>Pessoas idosas</strong>
                    <p>
                      Têm direito à autonomia, acessibilidade e explicações claras. Dados só podem
                      ser compartilhados com familiar, cuidador ou apoiador por escolha da pessoa ou
                      por outra hipótese legal válida.
                    </p>
                  </article>
                </div>
                <p className="children-note">
                  <strong>Crianças:</strong> contas e dados de crianças exigem participação e
                  consentimento específico e destacado de responsável legal, salvo exceções
                  previstas em lei, sempre em seu melhor interesse.
                </p>
              </section>

              <section>
                <h3>Seus direitos</h3>
                <p>
                  Você pode confirmar o tratamento, acessar, corrigir e obter uma cópia dos seus
                  dados, pedir eliminação quando aplicável e revogar consentimentos opcionais. Use
                  <strong> Perfil → Privacidade e meus dados</strong> para exportar, corrigir ou
                  excluir. Permissões do dispositivo também podem ser alteradas nas configurações.
                </p>
              </section>

              <section>
                <h3>Armazenamento, segurança e emergência</h3>
                <p>
                  Dados essenciais podem ficar no dispositivo para uso offline e, quando a pessoa
                  está autenticada, ser sincronizados com a conta. O acesso é restrito à própria
                  conta. Nenhum sistema elimina todos os riscos, por isso o TEApoia coleta apenas o
                  necessário e oferece exclusão. O aplicativo é apoio, não diagnóstico, tratamento
                  ou substituto de serviço de emergência.
                </p>
              </section>
            </div>

            <footer>
              <button className="primary-button" type="button" onClick={() => setOpen(false)}>
                Entendi e quero voltar
              </button>
            </footer>
          </article>
        </div>
      )}
    </>
  )
}

function PostLoginPrivacyModal({
  onAccept,
  onDecline,
}: {
  onAccept: () => Promise<boolean>
  onDecline: () => Promise<void>
}) {
  const [accepted, setAccepted] = useState(false)
  const [processing, setProcessing] = useState(false)

  async function accept() {
    if (!accepted || processing) return
    setProcessing(true)
    const completed = await onAccept()
    if (!completed) setProcessing(false)
  }

  async function decline() {
    if (processing) return
    setProcessing(true)
    await onDecline()
  }

  return (
    <div className="privacy-decision-backdrop" role="presentation">
      <section
        className="privacy-decision-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-decision-title"
      >
        <div className="privacy-decision-icon">
          <ShieldCheck aria-hidden="true" />
        </div>
        <p className="privacy-decision-step">Login confirmado</p>
        <h2 id="privacy-decision-title">Antes de continuar, cuide dos seus dados</h2>
        <p>
          Leia o aviso e escolha se deseja continuar. Se você não aceitar, sua sessão será encerrada
          e nenhum acesso ao aplicativo será liberado.
        </p>
        <PrivacyNoticeDialog label="Ler o Aviso de Tratamento de Dados" />
        <label className="checkbox-field privacy-checkbox privacy-decision-checkbox">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          Li o aviso e aceito continuar com o tratamento necessário dos meus dados.
        </label>
        <button
          className="primary-button"
          type="button"
          onClick={accept}
          disabled={!accepted || processing}
        >
          {processing ? 'Registrando escolha…' : 'Aceitar e continuar'}
        </button>
        <button
          className="privacy-decision-decline"
          type="button"
          onClick={decline}
          disabled={processing}
        >
          Não aceitar e sair
        </button>
      </section>
    </div>
  )
}

function RegisterScreen({
  onCreate,
  onLogin,
}: {
  onCreate: (data: {
    name: string
    email: string
    password: string
    acceptedPrivacy: boolean
  }) => Promise<AuthResult>
  onLogin: () => void
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const checks = [
    { label: '8 ou mais caracteres', valid: password.length >= 8 },
    { label: 'Uma letra maiúscula', valid: /[A-Z]/.test(password) },
    { label: 'Uma letra minúscula', valid: /[a-z]/.test(password) },
    { label: 'Um número', valid: /\d/.test(password) },
    { label: 'Um caractere especial', valid: /[^A-Za-z0-9]/.test(password) },
  ]
  const passwordStrong = checks.every((check) => check.valid)
  const passwordsMatch = confirmation.length > 0 && password === confirmation

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!passwordStrong) {
      setError('Crie uma senha que atenda a todos os requisitos.')
      return
    }
    if (!passwordsMatch) {
      setError('As senhas digitadas não são iguais.')
      return
    }
    setSubmitting(true)
    setError('')
    const result = await onCreate({ name, email, password, acceptedPrivacy })
    if (!result.ok) setError(result.message || 'Não foi possível criar a conta.')
    setSubmitting(false)
  }

  return (
    <section className="register-screen">
      <div className="screen-heading compact-heading">
        <h1>
          Vamos criar sua conta?
          <br />É rápido e simples!
        </h1>
      </div>
      <form className="register-form" onSubmit={submit}>
        <label>
          Nome
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
          />
        </label>
        <label>
          E-mail
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seuemail@exemplo.com"
          />
        </label>
        <label>
          Senha
          <span className="password-field">
            <input
              required
              minLength={8}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Crie uma senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </span>
        </label>
        <div className="password-requirements" aria-live="polite">
          <strong>Sua senha precisa ter:</strong>
          {checks.map((check) => (
            <span className={check.valid ? 'valid' : ''} key={check.label}>
              {check.valid ? <Check /> : <span aria-hidden="true">•</span>}
              {check.label}
            </span>
          ))}
        </div>
        <label>
          Repetir senha
          <input
            required
            minLength={8}
            type={showPassword ? 'text' : 'password'}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="Digite a senha novamente"
          />
        </label>
        {confirmation && (
          <p className={passwordsMatch ? 'form-success' : 'form-error'}>
            {passwordsMatch ? 'As senhas são iguais.' : 'As senhas não são iguais.'}
          </p>
        )}
        <div className="privacy-consent-summary">
          <ShieldCheck aria-hidden="true" />
          <span>
            <strong>Antes de marcar, saiba como seus dados serão cuidados.</strong>
            Você pode consultar o aviso agora e novamente em Perfil → Privacidade e meus dados.
          </span>
        </div>
        <PrivacyNoticeDialog />
        <label className="checkbox-field privacy-checkbox" htmlFor="privacy-acceptance">
          <input
            id="privacy-acceptance"
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(event) => setAcceptedPrivacy(event.target.checked)}
          />
          Li o Aviso de Tratamento de Dados e estou ciente do uso necessário dos meus dados para
          criar e utilizar minha conta.
        </label>
        {error && <p className="form-error">{error}</p>}
        <button
          className="primary-button form-submit"
          type="submit"
          disabled={!passwordStrong || !passwordsMatch || !acceptedPrivacy || submitting}
        >
          {submitting ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>
      <button className="text-button" onClick={onLogin}>
        Já tem uma conta? <strong>Entrar</strong>
      </button>
      <p className="access-note">
        Seus dados são protegidos e utilizados apenas para melhorar sua experiência.
      </p>
    </section>
  )
}

function EmailLoginScreen({
  onLogin,
  onForgot,
}: {
  onLogin: (email: string, password: string) => Promise<AuthResult>
  onForgot: () => void
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState(() => storage.getItem('teapoia-account-email') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const result = await onLogin(email, password)
    if (!result.ok) setError(result.message || 'Não foi possível entrar.')
    setSubmitting(false)
  }

  return (
    <section className="auth-flow-screen">
      <div className="auth-flow-icon">
        <Mail />
      </div>
      <div className="screen-heading compact-heading">
        <h1>Entrar com e-mail</h1>
        <p>Use o e-mail e a senha cadastrados na sua conta.</p>
      </div>
      <form className="register-form auth-flow-form" onSubmit={submit}>
        <label>
          E-mail
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seuemail@exemplo.com"
          />
        </label>
        <label>
          Senha
          <span className="password-field">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </span>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button form-submit" type="submit" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <button className="forgot-password-button" onClick={onForgot}>
        Esqueci minha senha
      </button>
    </section>
  )
}

function VerifyEmailScreen({
  email,
  onConfirm,
  onResend,
}: {
  email: string
  onConfirm: () => void
  onResend: () => void
}) {
  return (
    <section className="auth-flow-screen auth-feedback-screen">
      <div className="auth-flow-icon verification-icon">
        <Mail />
        <Check />
      </div>
      <div className="screen-heading compact-heading">
        <h1>Confirme seu e-mail</h1>
        <p>
          Enviamos um link de confirmação para <strong>{email}</strong>.
        </p>
      </div>
      <div className="auth-instructions">
        <span>1</span>
        <p>Abra a mensagem enviada pelo TEApoia.</p>
        <span>2</span>
        <p>Toque no link “Confirmar meu cadastro”.</p>
        <span>3</span>
        <p>Volte ao aplicativo para continuar.</p>
      </div>
      <button className="primary-button" onClick={onConfirm}>
        <ShieldCheck /> Já confirmei meu e-mail
      </button>
      <button className="auth-secondary-action" onClick={onResend}>
        Não recebeu? Enviar novamente
      </button>
      <p className="auth-small-note">Confira também a pasta de spam ou lixo eletrônico.</p>
    </section>
  )
}

function ForgotPasswordScreen({ onSend }: { onSend: (email: string) => Promise<AuthResult> }) {
  const [email, setEmail] = useState(() => storage.getItem('teapoia-account-email') || '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const result = await onSend(email)
    if (!result.ok) setError(result.message || 'Não foi possível enviar o código.')
    setSubmitting(false)
  }

  return (
    <section className="auth-flow-screen">
      <div className="auth-flow-icon">
        <KeyRound />
      </div>
      <div className="screen-heading compact-heading">
        <h1>Recuperar senha</h1>
        <p>Informe o e-mail cadastrado para receber um código de recuperação.</p>
      </div>
      <form className="register-form auth-flow-form" onSubmit={submit}>
        <label>
          E-mail cadastrado
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seuemail@exemplo.com"
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button form-submit" type="submit" disabled={submitting}>
          {submitting ? 'Enviando…' : 'Enviar código'}
        </button>
      </form>
      <p className="auth-small-note">
        O código será válido por 10 minutos e poderá ser usado apenas uma vez.
      </p>
    </section>
  )
}

function RecoveryCodeScreen({
  email,
  onValidate,
  onResend,
}: {
  email: string
  onValidate: (code: string) => Promise<AuthResult>
  onResend: () => Promise<void>
}) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const [submitting, setSubmitting] = useState(false)

  async function validate() {
    if (code.length !== 6) {
      setError('Digite os 6 números enviados para o seu e-mail.')
      return
    }
    setSubmitting(true)
    setError('')
    const result = await onValidate(code)
    if (!result.ok) setError(result.message || 'Código inválido.')
    setSubmitting(false)
  }

  return (
    <section className="auth-flow-screen auth-feedback-screen">
      <div className="auth-flow-icon">
        <KeyRound />
      </div>
      <div className="screen-heading compact-heading">
        <h1>Digite o código</h1>
        <p>
          Enviamos um código de 6 números para <strong>{email}</strong>.
        </p>
      </div>
      <label className="code-field">
        Código de recuperação
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
          placeholder="000000"
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button" onClick={validate} disabled={submitting}>
        {submitting ? 'Validando…' : 'Validar código'}
      </button>
      <button className="auth-secondary-action" onClick={onResend}>
        Enviar outro código
      </button>
    </section>
  )
}

function NewPasswordScreen({ onSave }: { onSave: (password: string) => Promise<AuthResult> }) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const [submitting, setSubmitting] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError(
        'Use pelo menos 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.',
      )
      return
    }
    if (password !== confirmation) {
      setError('As senhas digitadas não são iguais.')
      return
    }
    setSubmitting(true)
    setError('')
    const result = await onSave(password)
    if (!result.ok) setError(result.message || 'Não foi possível alterar a senha.')
    setSubmitting(false)
  }

  return (
    <section className="auth-flow-screen">
      <div className="auth-flow-icon">
        <ShieldCheck />
      </div>
      <div className="screen-heading compact-heading">
        <h1>Crie uma nova senha</h1>
        <p>Escolha uma senha segura e diferente da anterior.</p>
      </div>
      <form className="register-form auth-flow-form" onSubmit={submit}>
        <label>
          Nova senha
          <span className="password-field">
            <input
              required
              minLength={8}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite a nova senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </span>
        </label>
        <label>
          Confirmar nova senha
          <input
            required
            minLength={8}
            type={showPassword ? 'text' : 'password'}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="Repita a nova senha"
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button form-submit" type="submit" disabled={submitting}>
          {submitting ? 'Salvando…' : 'Salvar nova senha'}
        </button>
      </form>
    </section>
  )
}

function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="home-screen">
      <div className="screen-heading">
        <h1>Como você está agora?</h1>
      </div>
      <div className="feeling-list">
        <FeelingButton
          icon={<Meh />}
          tone="yellow"
          title="Estou começando a sentir sobrecarga"
          subtitle="Quero evitar que piore."
          onClick={() => go('yellow')}
        />
        <FeelingButton
          icon={<Frown />}
          tone="orange"
          title="Estou em sobrecarga intensa"
          subtitle="Preciso me regular."
          onClick={() => go('orange')}
        />
        <FeelingButton
          icon={<TriangleAlert />}
          tone="red"
          title="Preciso de ajuda"
          subtitle="Quero acionar meu suporte."
          onClick={() => go('support')}
        />
        <FeelingButton
          icon={<MessageCircle />}
          tone="blue"
          title="Não consigo me comunicar"
          subtitle="Preciso de uma mensagem."
          onClick={() => go('messages')}
        />
      </div>
    </section>
  )
}

function FeelingButton({
  icon,
  tone,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode
  tone: string
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button className={`feeling-button feeling-${tone}`} onClick={onClick}>
      <span className="feeling-icon">{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
    </button>
  )
}

function OptionsScreen({
  variant,
  go,
  onDiary,
  toast,
}: {
  variant: 'yellow' | 'orange'
  go: (screen: Screen) => void
  onDiary: () => void
  toast: (message: string) => void
}) {
  const orange = variant === 'orange'
  const actions = orange
    ? [
        {
          icon: <Wind />,
          title: 'Exercício de respiração',
          subtitle: 'Técnica guiada 4–7–8',
          action: () => go('breathing'),
        },
        {
          icon: <Music2 />,
          title: 'Ouvir minha playlist',
          subtitle: 'Abrir no Spotify ou outro serviço',
          action: () => go('playlist'),
        },
        {
          icon: <Hand />,
          title: 'Movimentos que me ajudam',
          subtitle: 'Stims e movimentos seguros',
          action: () => go('moves'),
        },
        {
          icon: <Ear />,
          title: 'Modo silencioso',
          subtitle: 'Silenciar sons e notificações',
          action: () => go('silent'),
        },
        {
          icon: <MapPinHouse />,
          title: 'Encontrar um lugar tranquilo',
          subtitle: 'Em casa ou perto de você',
          action: () => go('quiet'),
        },
        {
          icon: <MessageCircle />,
          title: 'Não quero falar agora',
          subtitle: 'Mostrar uma mensagem',
          action: () => go('messages'),
        },
      ]
    : [
        {
          icon: <Wind />,
          title: 'Exercício de respiração',
          subtitle: 'Técnica guiada 4–7–8',
          action: () => go('breathing'),
        },
        {
          icon: <Music2 />,
          title: 'Ouvir minha playlist',
          subtitle: 'Abrir no Spotify',
          action: () => go('playlist'),
        },
        {
          icon: <Lightbulb />,
          title: 'Diminuir a luz e os estímulos',
          subtitle: 'Dicas práticas',
          action: () => go('stimuli'),
        },
        {
          icon: <MapPinHouse />,
          title: 'Encontrar um lugar tranquilo',
          subtitle: 'Em casa ou perto de você',
          action: () => go('quiet'),
        },
        {
          icon: <Pencil />,
          title: 'Meu diário',
          subtitle: 'Escrever sobre o que estou sentindo',
          action: onDiary,
        },
      ]

  return (
    <section className={`options-screen options-${variant}`}>
      <div className={`state-symbol state-${variant}`}>{orange ? <Frown /> : <Meh />}</div>
      <div className="screen-heading options-heading">
        <h1>{orange ? 'Você está em sobrecarga intensa' : 'Você está sentindo sobrecarga'}</h1>
        <p>
          {orange
            ? 'Agora o foco é reduzir os estímulos e te ajudar a se recuperar.'
            : 'Vamos tentar evitar que piore. Aqui estão algumas opções que podem te ajudar:'}
        </p>
      </div>
      <div className="support-action-list">
        {actions.map((item) => (
          <button key={item.title} onClick={item.action}>
            <span className="action-icon">{item.icon}</span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="reassurance">
        <strong>{orange ? 'Tudo bem precisar de um tempo.' : 'Lembre-se:'}</strong>
        <span>
          {orange ? 'Você não precisa passar por isso sem apoio.' : 'você consegue cuidar de você.'}
        </span>
      </div>
    </section>
  )
}

function BreathingScreen() {
  const [playing, setPlaying] = useState(true)
  const [breathing, setBreathing] = useState<{
    phase: 'Inspire' | 'Segure' | 'Expire'
    seconds: number
    cycle: number
  }>({
    phase: 'Inspire',
    seconds: 4,
    cycle: 1,
  })

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setBreathing((current) => {
        if (current.seconds > 1) {
          return { ...current, seconds: current.seconds - 1 }
        }
        if (current.phase === 'Inspire') {
          return { ...current, phase: 'Segure', seconds: 7 }
        }
        if (current.phase === 'Segure') {
          return { ...current, phase: 'Expire', seconds: 8 }
        }
        return {
          phase: 'Inspire',
          seconds: 4,
          cycle: current.cycle === 4 ? 1 : current.cycle + 1,
        }
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [playing])

  return (
    <section className="breathing-screen">
      <Wind className="feature-icon breathing-feature" />
      <div className="screen-heading compact-heading">
        <h1>
          Respiração guiada
          <br />
          4–7–8
        </h1>
        <p>Um exercício simples para te ajudar a se acalmar e reduzir a tensão.</p>
      </div>
      <div className={`breathing-circle breath-${breathing.phase.toLowerCase()}`}>
        <span>{breathing.phase === 'Inspire' ? 'Inspire pelo nariz' : breathing.phase}</span>
        <strong>{breathing.seconds}</strong>
      </div>
      <strong className="cycle-label">Ciclo {breathing.cycle} de 4</strong>
      <div className="cycle-dots">
        {[1, 2, 3, 4].map((item) => (
          <span className={item <= breathing.cycle ? 'active' : ''} key={item} />
        ))}
      </div>
      <p className="breathing-note">
        Sente ou deite em um lugar confortável.
        <br />
        Vamos respirar em conjunto.
      </p>
      <button className="pause-button" onClick={() => setPlaying(!playing)}>
        {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        {playing ? 'Pausar' : 'Continuar'}
      </button>
    </section>
  )
}

function MovementsScreen({ toast }: { toast: (message: string) => void }) {
  const [selectedMovements, setSelectedMovements] = useState<string[]>([])

  function toggleMovement(movement: string) {
    setSelectedMovements((current) =>
      current.includes(movement)
        ? current.filter((item) => item !== movement)
        : [...current, movement],
    )
  }

  return (
    <section className="movements-screen">
      <Hand className="feature-icon hand-feature" />
      <div className="screen-heading compact-heading">
        <h1>Movimentos que podem te ajudar</h1>
        <p>
          Escolha os movimentos que fazem sentido para você. Você não precisa fazer todos.
        </p>
      </div>

      <div
        className="movement-list"
        role="group"
        aria-label="Escolha movimentos autorregulatórios"
      >
        {movementOptions.map((movement) => {
          const selected = selectedMovements.includes(movement)
          return (
            <label
              key={movement}
              className={`movement-choice ${selected ? 'selected' : ''}`}
            >
              <span className="movement-choice-icon" aria-hidden="true">
                <Hand size={21} />
              </span>
              <span className="movement-choice-label">{movement}</span>
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggleMovement(movement)}
                aria-label={`Selecionar: ${movement}`}
              />
            </label>
          )
        })}
      </div>

      <div className="movement-selection-status" role="status" aria-live="polite">
        <Check size={19} aria-hidden="true" />
        <span>
          {selectedMovements.length === 0
            ? 'Escolha uma ou mais opções, se quiser. Você também pode não selecionar nenhuma.'
            : `${selectedMovements.length} ${selectedMovements.length === 1 ? 'movimento escolhido' : 'movimentos escolhidos'}. Faça apenas o que estiver confortável.`}
        </span>
      </div>

      <div className="info-card movement-safety-note">
        <CircleAlert />
        <span>
          <strong>Cuide da sua segurança.</strong> Faça os movimentos no seu ritmo e sem forçar o
          corpo. Não faça nada que possa machucar você ou outra pessoa. Evite movimentos que causem
          dor, tontura ou desconforto e pare se isso acontecer. Prefira um espaço livre de
          obstáculos. Você pode adaptar ou interromper qualquer movimento sempre que precisar.
        </span>
      </div>
    </section>
  )
}

function PlaylistScreen({ requestPermission }: { requestPermission: PermissionRequester }) {
  const providers = [
    { name: 'Spotify', url: 'https://open.spotify.com', tone: 'spotify' },
    {
      name: 'YouTube Music',
      url: 'https://music.youtube.com',
      tone: 'youtube',
    },
    { name: 'Deezer', url: 'https://www.deezer.com', tone: 'deezer' },
    { name: 'Apple Music', url: 'https://music.apple.com', tone: 'apple' },
  ]
  const [linkedProvider, setLinkedProvider] = useState(
    () => storage.getItem('teapoia-music-provider') || '',
  )

  async function linkProvider(name: string) {
    const allowed = await requestPermission(
      'music',
      `Vincular com ${name}?`,
      `O TEApoia abrirá o ${name} para você acessar suas músicas. Nenhuma música será reproduzida sem a sua ação.`,
    )
    if (!allowed) return
    storage.setItem('teapoia-music-provider', name)
    setLinkedProvider(name)
  }

  async function openProvider(url: string, name: string) {
    const allowed = await requestPermission(
      'music',
      `Abrir ${name}?`,
      `Vamos direcionar você para o aplicativo ou site do ${name}.`,
    )
    if (allowed) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="playlist-screen">
      <Music2 className="feature-icon music-feature" />
      <div className="screen-heading compact-heading">
        <h1>Sua playlist de conforto</h1>
        <p>Vincule o aplicativo de música que você prefere para acessar sua playlist.</p>
      </div>
      <div className="music-providers">
        {providers.map((provider) => {
          const linked = linkedProvider === provider.name
          return (
            <div className={`music-provider provider-${provider.tone}`} key={provider.name}>
              <span>{provider.name === 'Apple Music' ? <Apple /> : <Music2 />}</span>
              <strong>{provider.name}</strong>
              {linked ? (
                <button onClick={() => openProvider(provider.url, provider.name)}>
                  Abrir <ExternalLink />
                </button>
              ) : (
                <button onClick={() => linkProvider(provider.name)}>Vincular</button>
              )}
            </div>
          )
        })}
      </div>
      <div className="info-card playlist-tip">
        <Lightbulb />
        <span>
          <strong>Dica</strong>
          Você pode trocar o aplicativo vinculado quando quiser. A playlist continua sob o seu
          controle.
        </span>
      </div>
    </section>
  )
}

function QuietPlacesScreen({
  toast,
  requestPermission,
}: {
  toast: (message: string) => void
  requestPermission: PermissionRequester
}) {
  const [context, setContext] = useState<'home' | 'outside'>('home')

  async function searchNearby() {
    if (!navigator.onLine) {
      toast('A busca no mapa precisa de internet. As orientações gerais continuam disponíveis.')
      return
    }
    const allowed = await requestPermission(
      'location',
      'Permitir acesso à localização?',
      'O TEApoia usará sua localização atual apenas para buscar lugares tranquilos próximos no mapa.',
    )
    if (!allowed) return
    if (!navigator.geolocation) {
      window.open('https://www.google.com/maps/search/lugar+tranquilo', '_blank')
      return
    }
    toast('Buscando lugares tranquilos perto de você…')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        window.open(
          `https://www.google.com/maps/search/parques+bibliotecas+lugares+tranquilos/@${coords.latitude},${coords.longitude},15z`,
          '_blank',
        )
      },
      () => {
        window.open('https://www.google.com/maps/search/lugar+tranquilo', '_blank')
      },
    )
  }

  const suggestions =
    context === 'home'
      ? [
          {
            icon: <Sofa />,
            title: 'Um canto conhecido',
            text: 'Quarto, sofá ou outro local confortável.',
          },
          {
            icon: <Ear />,
            title: 'Menos sons',
            text: 'Feche a porta e use abafadores, se ajudarem.',
          },
          {
            icon: <Lightbulb />,
            title: 'Luz mais suave',
            text: 'Diminua o brilho ou feche as cortinas.',
          },
        ]
      : [
          {
            icon: <TreePine />,
            title: 'Parque ou praça',
            text: 'Procure uma área segura e menos movimentada.',
          },
          {
            icon: <BookOpen />,
            title: 'Biblioteca',
            text: 'Espaços de leitura costumam ter menos ruído.',
          },
          {
            icon: <Coffee />,
            title: 'Local de pausa',
            text: 'Uma área lateral ou mesa mais afastada.',
          },
        ]

  return (
    <section className="quiet-screen">
      <MapPinHouse className="feature-icon quiet-feature" />
      <div className="screen-heading compact-heading">
        <h1>Encontrar um lugar tranquilo</h1>
        <p>Escolha onde você está para ver opções com menos estímulos.</p>
      </div>
      <div className="context-switch">
        <button className={context === 'home' ? 'active' : ''} onClick={() => setContext('home')}>
          <House /> Estou em casa
        </button>
        <button
          className={context === 'outside' ? 'active' : ''}
          onClick={() => setContext('outside')}
        >
          <MapPin /> Estou na rua
        </button>
      </div>
      <div className="place-list">
        {suggestions.map((suggestion) => (
          <article key={suggestion.title}>
            <span>{suggestion.icon}</span>
            <span>
              <strong>{suggestion.title}</strong>
              <small>{suggestion.text}</small>
            </span>
          </article>
        ))}
      </div>
      {context === 'outside' && (
        <button className="primary-button nearby-button" onClick={searchNearby}>
          <LocateFixed /> Buscar perto de mim
        </button>
      )}
      <div className="info-card">
        <CircleAlert />
        <span>Escolha sempre um local seguro. Se precisar, peça ajuda a alguém de confiança.</span>
      </div>
    </section>
  )
}

function SilentModeScreen({
  toast,
  requestPermission,
}: {
  toast: (message: string) => void
  requestPermission: PermissionRequester
}) {
  async function openSoundSettings() {
    const allowed = await requestPermission(
      'sound',
      'Abrir configurações de som?',
      'O TEApoia tentará abrir as configurações do celular. Somente você poderá ativar o modo silencioso ou Não perturbe.',
    )
    if (!allowed) return
    toast('Se as configurações não abrirem, use os passos acima.')
    window.location.href = 'intent:#Intent;action=android.settings.SOUND_SETTINGS;end'
  }

  return (
    <section className="silent-screen">
      <Ear className="feature-icon silent-feature" />
      <div className="screen-heading compact-heading">
        <h1>Modo silencioso</h1>
        <p>Reduza sons e notificações do celular com poucos passos.</p>
      </div>
      <div className="silent-steps">
        <article>
          <span>1</span>
          <div>
            <strong>Abra os controles rápidos</strong>
            <small>Deslize a tela de cima para baixo.</small>
          </div>
        </article>
        <article>
          <span>2</span>
          <div>
            <strong>Toque em Som ou Não perturbe</strong>
            <small>Escolha Silencioso para parar os alertas.</small>
          </div>
        </article>
        <article>
          <span>3</span>
          <div>
            <strong>Reduza o volume de mídia</strong>
            <small>Use os botões laterais, se isso ajudar.</small>
          </div>
        </article>
      </div>
      <button className="sound-settings-button" onClick={openSoundSettings}>
        <Smartphone /> Abrir configurações de som
      </button>
      <div className="info-card">
        <CircleAlert />
        <span>
          Por segurança, sites não podem silenciar o celular automaticamente. Você continua no
          controle dessa configuração.
        </span>
      </div>
    </section>
  )
}

function ReduceStimuliScreen() {
  const [selectedTips, setSelectedTips] = useState<string[]>([])
  const tips = [
    {
      id: 'light',
      icon: <Lightbulb />,
      title: 'Reduza a iluminação',
      text: 'Diminua o brilho, apague uma luz ou feche a cortina, se puder.',
    },
    {
      id: 'screen',
      icon: <Smartphone />,
      title: 'Ajuste a tela',
      text: 'Reduza o brilho do celular e ative o modo escuro ou de leitura.',
    },
    {
      id: 'sound',
      icon: <Ear />,
      title: 'Diminua os sons',
      text: 'Afaste-se de ruídos ou use abafadores e fones sem música.',
    },
    {
      id: 'visual',
      icon: <Eye />,
      title: 'Reduza estímulos visuais',
      text: 'Olhe para um ponto neutro e deixe apenas o necessário por perto.',
    },
    {
      id: 'space',
      icon: <MapPinHouse />,
      title: 'Mude de ambiente',
      text: 'Se for seguro, procure um canto mais calmo e conhecido.',
    },
  ]

  function toggleTip(id: string) {
    setSelectedTips((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <section className="stimuli-screen">
      <Lightbulb className="feature-icon stimuli-feature" />
      <div className="screen-heading compact-heading">
        <h1>Diminuir luz e estímulos</h1>
        <p>Escolha uma ação simples. Você não precisa fazer todas.</p>
      </div>
      <div className="stimuli-tip-list">
        {tips.map((tip) => {
          const selected = selectedTips.includes(tip.id)
          return (
            <button
              className={selected ? 'selected' : ''}
              key={tip.id}
              onClick={() => toggleTip(tip.id)}
              aria-pressed={selected}
            >
              <span>{tip.icon}</span>
              <span>
                <strong>{tip.title}</strong>
                <small>{tip.text}</small>
              </span>
              <span className="tip-check">{selected && <Check />}</span>
            </button>
          )
        })}
      </div>
      {selectedTips.length > 0 && (
        <div className="stimuli-progress" role="status">
          <Check />
          <span>
            {selectedTips.length === 1
              ? 'Uma ação escolhida. Faça no seu ritmo.'
              : `${selectedTips.length} ações escolhidas. Faça apenas o que estiver confortável.`}
          </span>
        </div>
      )}
      <div className="info-card">
        <CircleAlert />
        <span>Essas são sugestões de apoio. Pare se alguma delas causar desconforto.</span>
      </div>
    </section>
  )
}

function WriteDiaryScreen({
  value,
  setValue,
  onSave,
}: {
  value: string
  setValue: (value: string) => void
  onSave: () => void
}) {
  return (
    <section className="write-screen">
      <Pencil className="feature-icon pencil-feature" />
      <div className="screen-heading compact-heading">
        <h1>Como você se sente agora?</h1>
        <p>
          Colocar seus pensamentos no papel pode te ajudar a se organizar. Você pode escrever
          livremente sobre o que está sentindo.
        </p>
      </div>
      <textarea
        maxLength={500}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Escreva aqui..."
      />
      <span className="character-count">{value.length}/500</span>
      <button className="primary-button" onClick={onSave}>
        Salvar no meu diário
      </button>
      <div className="info-card safe-note">
        <CircleAlert />
        <span>
          Não existe certo ou errado.
          <br />
          Esse é um espaço seguro para você.
        </span>
      </div>
    </section>
  )
}

function SavedScreen({ onDiary, onWrite }: { onDiary: () => void; onWrite: () => void }) {
  return (
    <section className="saved-screen">
      <div className="confetti" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="success-mark">
        <Check />
      </div>
      <h1>Registro salvo!</h1>
      <p>Seu registro foi adicionado ao seu diário.</p>
      <span className="saved-date">
        {new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date())}
      </span>
      <button className="primary-button" onClick={onDiary}>
        Ver meu diário
      </button>
      <button className="soft-button" onClick={onWrite}>
        Escrever outro registro
      </button>
    </section>
  )
}

function DiaryScreen({ text, onWrite }: { text: string; onWrite: () => void }) {
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'today' | 'overload' | 'calm'>('all')
  const [entries, setEntries] = useState<
    {
      id: number
      tone: string
      text: string
      date: string
    }[]
  >(() => {
    const saved = storage.getItem('teapoia-diary-entries')
    let initialEntries: { id: number; tone: string; text: string; date: string }[]
    if (saved) {
      try {
        initialEntries = JSON.parse(saved).map(
          (entry: { id: number; tone: string; text: string; date: string }) =>
            entry.text === 'Hoje me senti muito sobrecarregada no shopping...'
              ? {
                  ...entry,
                  text: 'Hoje senti uma sobrecarga intensa no shopping...',
                }
              : entry,
        )
      } catch {
        storage.removeItem('teapoia-diary-entries')
        initialEntries = []
      }
    } else {
      initialEntries = []
    }
    if (text.trim() && !initialEntries.some((entry) => entry.text === text.trim())) {
      initialEntries.unshift({
        id: Date.now(),
        tone: 'blue',
        text: text.trim(),
        date: `Hoje · ${new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date())}`,
      })
    }
    return initialEntries
  })

  useEffect(() => {
    storage.setItem('teapoia-diary-entries', JSON.stringify(entries))
  }, [entries])

  const visibleEntries = entries.filter((entry) => {
    const matchesSearch = entry.text
      .toLocaleLowerCase('pt-BR')
      .includes(query.toLocaleLowerCase('pt-BR'))
    const matchesFilter =
      filter === 'all' ||
      (filter === 'today' && entry.date.startsWith('Hoje')) ||
      (filter === 'overload' && ['purple', 'yellow', 'blue'].includes(entry.tone)) ||
      (filter === 'calm' && ['green', 'pink'].includes(entry.tone))
    return matchesSearch && matchesFilter
  })

  function deleteEntry(id: number) {
    if (!window.confirm('Deseja excluir este registro definitivamente?')) return
    setEntries((current) => current.filter((entry) => entry.id !== id))
  }

  function editEntry(id: number) {
    const entry = entries.find((item) => item.id === id)
    if (!entry) return
    const nextText = window.prompt('Edite seu registro:', entry.text)
    if (!nextText?.trim()) return
    setEntries((current) =>
      current.map((item) => (item.id === id ? { ...item, text: nextText.trim() } : item)),
    )
  }

  return (
    <section className="generic-screen diary-screen">
      <BookOpen className="feature-icon diary-feature" />
      <div className="screen-heading compact-heading">
        <h1>Meu diário</h1>
        <p>Seus registros ficam aqui para você consultar quando quiser.</p>
      </div>
      <div className="diary-search">
        <label>
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar nos registros..."
          />
        </label>
        <button
          className={filter !== 'all' ? 'filter-active' : ''}
          onClick={() => setFilterOpen(!filterOpen)}
          aria-label="Filtrar registros"
          aria-expanded={filterOpen}
        >
          <SlidersHorizontal />
        </button>
      </div>
      {filterOpen && (
        <div className="diary-filters">
          <div>
            <strong>Filtrar registros</strong>
            <button onClick={() => setFilterOpen(false)} aria-label="Fechar filtros">
              <X />
            </button>
          </div>
          <div className="filter-options">
            {[
              ['all', 'Todos'],
              ['today', 'Hoje'],
              ['overload', 'Sobrecarga'],
              ['calm', 'Momentos tranquilos'],
            ].map(([value, label]) => (
              <button
                className={filter === value ? 'selected' : ''}
                onClick={() => setFilter(value as typeof filter)}
                key={value}
              >
                {filter === value && <Check />}
                {label}
              </button>
            ))}
          </div>
          <span>
            {visibleEntries.length}{' '}
            {visibleEntries.length === 1 ? 'registro encontrado' : 'registros encontrados'}
          </span>
        </div>
      )}
      <div className="diary-month">Setembro de 2026</div>
      <div className="diary-list">
        {visibleEntries.map((entry) => (
          <div className="diary-list-item" key={entry.id}>
            <button className="diary-entry-main" onClick={() => editEntry(entry.id)}>
              <span className={`entry-mood entry-${entry.tone}`}>•</span>
              <span>
                <strong>{entry.text}</strong>
                <small>{entry.date}</small>
              </span>
              <ChevronRight />
            </button>
            <button
              className="diary-delete"
              onClick={() => deleteEntry(entry.id)}
              aria-label="Excluir registro"
            >
              <Trash2 />
            </button>
          </div>
        ))}
        {visibleEntries.length === 0 && <p className="empty-state">Nenhum registro encontrado.</p>}
      </div>
      <button className="diary-new-button" onClick={onWrite}>
        <Plus /> Novo registro
      </button>
    </section>
  )
}

function MessagesScreen({
  authenticated,
  onLogin,
  toast,
}: {
  authenticated: boolean
  onLogin: () => void
  toast: (message: string) => void
}) {
  const [customMessages, setCustomMessages] = useState<
    {
      id: number
      text: string
    }[]
  >(() => {
    const saved = storage.getItem('teapoia-custom-messages')
    if (!saved) return []
    try {
      return JSON.parse(saved)
    } catch {
      return []
    }
  })
  const [creating, setCreating] = useState(false)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    storage.setItem('teapoia-custom-messages', JSON.stringify(customMessages))
  }, [customMessages])

  function speak(message: string) {
    if (!navigator.onLine) {
      toast('A voz artificial precisa de internet. Você ainda pode ler ou copiar a mensagem.')
      return
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(message))
    }
  }

  function startCreating() {
    if (!authenticated) {
      toast('Entre para criar e salvar mensagens personalizadas.')
      onLogin()
      return
    }
    setCreating(true)
  }

  function saveMessage() {
    if (!newMessage.trim()) return
    setCustomMessages((current) => [...current, { id: Date.now(), text: newMessage.trim() }])
    setNewMessage('')
    setCreating(false)
    toast('Mensagem personalizada salva.')
  }

  return (
    <section className="generic-screen">
      <MessageCircle className="feature-icon message-feature" />
      <div className="screen-heading compact-heading">
        <h1>Não quero falar agora</h1>
        <p>Escolha uma mensagem para mostrar, copiar ou reproduzir em áudio.</p>
      </div>
      <div className="message-list">
        {[
          ...quickMessages.map((message) => ({
            id: message,
            text: message,
            custom: false,
          })),
          ...customMessages.map((message) => ({ ...message, custom: true })),
        ].map((message) => (
          <article className={message.custom ? 'custom-message' : ''} key={message.id}>
            {message.custom && <small>Minha mensagem</small>}
            <p>{message.text}</p>
            <div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(message.text)
                  toast('Mensagem copiada.')
                }}
              >
                <Copy /> Copiar
              </button>
              <button onClick={() => speak(message.text)}>
                <Volume2 /> Ouvir
              </button>
              {message.custom && (
                <button
                  className="delete-message"
                  onClick={() =>
                    setCustomMessages((current) => current.filter((item) => item.id !== message.id))
                  }
                >
                  <Trash2 /> Apagar
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      <button className="add-message-button" onClick={startCreating}>
        <Plus /> Adicionar minha mensagem
      </button>
      {creating && (
        <div className="message-editor">
          <div>
            <strong>Nova mensagem</strong>
            <button onClick={() => setCreating(false)} aria-label="Fechar">
              <X />
            </button>
          </div>
          <textarea
            autoFocus
            maxLength={220}
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            placeholder="Escreva uma mensagem que ajude você a se comunicar..."
          />
          <span>{newMessage.length}/220</span>
          <button className="primary-button" onClick={saveMessage}>
            Salvar mensagem
          </button>
        </div>
      )}
    </section>
  )
}

function SupportScreen({
  authenticated,
  onLogin,
  onManageContacts,
  requestPermission,
}: {
  authenticated: boolean
  onLogin: () => void
  onManageContacts: () => void
  requestPermission: PermissionRequester
}) {
  const [contacts] = useState<EmergencyContact[]>(readContacts)

  async function callPhone(event: React.MouseEvent, phone: string, label: string) {
    event.preventDefault()
    const allowed = await requestPermission(
      'phone',
      `Ligar para ${label}?`,
      'O TEApoia abrirá o aplicativo de telefone. A ligação só será iniciada após sua confirmação no celular.',
    )
    if (allowed) window.location.href = `tel:${phone}`
  }

  async function openWhatsApp(event: React.MouseEvent, phone: string, label: string) {
    event.preventDefault()
    const allowed = await requestPermission(
      'whatsapp',
      `Abrir WhatsApp com ${label}?`,
      'O TEApoia abrirá uma conversa no WhatsApp usando o contato que você cadastrou.',
    )
    if (allowed) {
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section className="generic-screen support-screen">
      <TriangleAlert className="feature-icon support-feature" />
      <div className="screen-heading compact-heading">
        <h1>Preciso de ajuda</h1>
        <p>Escolha alguém de confiança para entrar em contato.</p>
      </div>
      {authenticated ? (
        <>
          <h2 className="contacts-title">Meus contatos de emergência</h2>
          <div className="emergency-list">
            {contacts.map((contact, index) => (
              <div className="emergency-contact" key={contact.id}>
                <span className={`contact-avatar avatar-${['blue', 'pink', 'purple'][index % 3]}`}>
                  <User />
                </span>
                <strong>{contact.name}</strong>
                <a
                  href={`tel:${contact.phone}`}
                  onClick={(event) => callPhone(event, contact.phone, contact.name)}
                >
                  <Phone /> Ligar
                </a>
                {contact.whatsapp && (
                  <a
                    className="whatsapp-button"
                    href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => openWhatsApp(event, contact.phone, contact.name)}
                  >
                    <MessageCircle /> WhatsApp
                  </a>
                )}
              </div>
            ))}
          </div>
          <button className="add-support-button" onClick={onManageContacts}>
            <Plus /> Adicionar contato de suporte
          </button>
        </>
      ) : (
        <div className="info-card login-prompt">
          <CircleUserRound />
          <span>Entre para acessar seus contatos pessoais de suporte.</span>
          <button onClick={onLogin}>Entrar</button>
        </div>
      )}
      <div className="cvv-card">
        <strong>CVV</strong>
        <p>
          Precisa conversar com alguém agora? O CVV oferece apoio emocional gratuito e sigiloso, 24
          horas.
        </p>
        <a href="tel:188" onClick={(event) => callPhone(event, '188', 'o CVV')}>
          <Phone /> Ligar para o CVV — 188
        </a>
        <a className="cvv-chat" href="https://cvv.org.br/chat/" target="_blank" rel="noreferrer">
          <MessageCircle /> Chat do CVV
        </a>
      </div>
    </section>
  )
}

type UserProfile = {
  name: string
  preferredName: string
  email: string
  phone: string
  photo: string
}

const defaultProfile: UserProfile = {
  name: '',
  preferredName: '',
  email: '',
  phone: '',
  photo: '',
}

function readProfile(): UserProfile {
  const saved = storage.getItem('teapoia-profile')
  if (!saved) return defaultProfile
  try {
    return { ...defaultProfile, ...JSON.parse(saved) }
  } catch {
    return defaultProfile
  }
}

function ProfileScreen({ go, onLogout }: { go: (screen: Screen) => void; onLogout: () => void }) {
  const [profile] = useState(readProfile)
  const options = [
    {
      icon: <User />,
      title: 'Meus dados',
      subtitle: 'Nome, e-mail, telefone e senha',
      screen: 'profileData' as Screen,
    },
    {
      icon: <Phone />,
      title: 'Meus contatos de emergência',
      subtitle: 'Adicionar e gerenciar pessoas de confiança',
      screen: 'profileContacts' as Screen,
    },
    {
      icon: <MessagesSquare />,
      title: 'Preferências de comunicação',
      subtitle: 'Ligação, mensagem e apoio quando falar estiver difícil',
      screen: 'profileCommunication' as Screen,
    },
    {
      icon: <ShieldCheck />,
      title: 'Privacidade e meus dados',
      subtitle: 'Consultar, exportar ou excluir seus dados',
      screen: 'privacy' as Screen,
    },
  ]

  return (
    <section className="profile-screen">
      <div className="screen-heading compact-heading">
        <h1>Meu perfil</h1>
        <p>Aqui você pode personalizar o TEApoia para as suas necessidades.</p>
      </div>
      <div className="profile-card">
        <span className="profile-avatar">
          {profile.photo ? (
            <Image src={profile.photo} width={80} height={80} alt="" unoptimized />
          ) : (
            <User />
          )}
        </span>
        <span>
          <strong>{profile.preferredName || profile.name}</strong>
          <button onClick={() => go('profileEdit')}>
            <Pencil /> Editar perfil
          </button>
        </span>
      </div>
      <div className="profile-options">
        {options.map((option) => (
          <button key={option.title} onClick={() => go(option.screen)}>
            <span>{option.icon}</span>
            <span>
              <strong>{option.title}</strong>
              <small>{option.subtitle}</small>
            </span>
            <ChevronRight />
          </button>
        ))}
      </div>
      <button className="logout-button" onClick={onLogout}>
        <LogOut />
        Sair da conta
      </button>
    </section>
  )
}

function PrivacyScreen({
  onAccountDeleted,
  toast,
}: {
  onAccountDeleted: () => void
  toast: (message: string) => void
}) {
  const [deleting, setDeleting] = useState(false)

  async function exportData() {
    const keys = Object.keys(window.localStorage).filter((key) => key.startsWith('teapoia-'))
    const data = Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `teapoia-meus-dados-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast('Arquivo com seus dados preparado.')
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      'Esta ação excluirá permanentemente sua conta, diário, mensagens e contatos. Deseja continuar?',
    )
    if (!confirmed) return
    const repeated = window.confirm(
      'Confirme novamente: não será possível recuperar os dados após a exclusão.',
    )
    if (!repeated) return

    setDeleting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 250))
    setDeleting(false)

    ;[
      'teapoia-demo-user',     
      'teapoia-authenticated',
      'teapoia-account-email',
      'teapoia-profile',
      'teapoia-diary-entries',
      'teapoia-custom-messages',
      'teapoia-emergency-contacts',
      'teapoia-communication-preferences',
      'teapoia-offline-session',
      'teapoia-last-local-save',
    ].forEach((key) => storage.removeItem(key))
    onAccountDeleted()
    toast('Sua conta e os dados associados foram excluídos.')
  }

  return (
    <section className="profile-editor-screen privacy-screen">
      <div className="screen-heading compact-heading">
        <h1>Privacidade e meus dados</h1>
        <p>Você controla seus dados pessoais conforme a LGPD.</p>
      </div>
      <div className="info-card">
        <ShieldCheck />
        <span>
          <strong>Uso necessário e transparente</strong>
          Seus dados são usados para oferecer os recursos escolhidos por você. Registros emocionais
          não são usados para publicidade.
        </span>
      </div>
      <div className="privacy-life-summary" aria-label="Proteção por etapa da vida">
        <strong>Autonomia e cuidado em todas as idades</strong>
        <p>
          Adultos e pessoas idosas mantêm sua autonomia. Para adolescentes, o tratamento considera o
          melhor interesse, a compreensão e a participação de responsável quando a lei exigir.
        </p>
      </div>
      <PrivacyNoticeDialog label="Ler como o TEApoia protege adultos, adolescentes e idosos" />
      <div className="privacy-actions">
        <button className="soft-button" onClick={exportData}>
          <BookOpen /> Exportar meus dados
        </button>
        <button className="logout-button" onClick={deleteAccount} disabled={deleting}>
          <Trash2 /> {deleting ? 'Excluindo…' : 'Excluir minha conta e dados'}
        </button>
      </div>
      <p className="auth-small-note">
        Você também pode corrigir seus dados nas telas de perfil e revogar permissões nas
        configurações do dispositivo.
      </p>
    </section>
  )
}

function ProfileEditScreen({
  onSave,
  requestPermission,
}: {
  onSave: () => void
  requestPermission: PermissionRequester
}) {
  const [profile, setProfile] = useState(readProfile)
  const [photoError, setPhotoError] = useState('')

  function selectPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 2_000_000) {
      setPhotoError('Escolha uma imagem com até 2 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProfile((current) => ({ ...current, photo: String(reader.result) }))
      setPhotoError('')
    }
    reader.readAsDataURL(file)
  }

  function save(event: React.FormEvent) {
    event.preventDefault()
    storage.setItem('teapoia-profile', JSON.stringify(profile))
    storage.setItem('teapoia-account-email', profile.email)
    onSave()
  }

  async function askForPhotoAccess() {
    const allowed = await requestPermission(
      'photos',
      'Acessar câmera ou fotos?',
      'O TEApoia abrirá o seletor do celular. Apenas a imagem escolhida por você será usada no perfil.',
    )
    if (allowed) document.getElementById('profile-photo-input')?.click()
  }

  return (
    <section className="profile-editor-screen">
      <div className="screen-heading compact-heading">
        <h1>Editar perfil</h1>
        <p>Escolha como você quer se identificar no TEApoia.</p>
      </div>
      <div className="photo-editor">
        <span className="profile-avatar profile-avatar-large">
          {profile.photo ? (
            <Image src={profile.photo} width={112} height={112} alt="Foto do perfil" unoptimized />
          ) : (
            <User />
          )}
        </span>
        <button className="photo-select-button" type="button" onClick={askForPhotoAccess}>
          <Camera /> Escolher foto
        </button>
        <input
          id="profile-photo-input"
          className="hidden-file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={selectPhoto}
        />
        {profile.photo && (
          <button
            className="photo-remove-button"
            onClick={() => setProfile({ ...profile, photo: '' })}
          >
            Remover foto
          </button>
        )}
      </div>
      {photoError && <p className="form-error">{photoError}</p>}
      <form className="register-form profile-form" onSubmit={save}>
        <label>
          Como você quer se identificar?
          <input
            required
            value={profile.preferredName}
            onChange={(event) => setProfile({ ...profile, preferredName: event.target.value })}
            placeholder="Seu nome ou apelido"
          />
        </label>
        <label>
          Nome completo
          <input
            required
            value={profile.name}
            onChange={(event) => setProfile({ ...profile, name: event.target.value })}
            placeholder="Seu nome completo"
          />
        </label>
        <button className="primary-button" type="submit">
          Salvar alterações
        </button>
      </form>
    </section>
  )
}

function ProfileDataScreen({
  onRecoverPassword,
  toast,
}: {
  onRecoverPassword: (email: string) => void
  toast: (message: string) => void
}) {
  const [profile, setProfile] = useState(readProfile)

  function save(event: React.FormEvent) {
    event.preventDefault()
    storage.setItem('teapoia-profile', JSON.stringify(profile))
    storage.setItem('teapoia-account-email', profile.email)
    toast('Dados pessoais atualizados.')
  }

  return (
    <section className="profile-editor-screen">
      <div className="screen-heading compact-heading">
        <h1>Meus dados</h1>
        <p>Consulte e atualize as informações vinculadas à sua conta.</p>
      </div>
      <form className="register-form profile-form" onSubmit={save}>
        <label>
          Nome completo
          <input
            required
            value={profile.name}
            onChange={(event) => setProfile({ ...profile, name: event.target.value })}
          />
        </label>
        <label>
          E-mail
          <input
            required
            type="email"
            value={profile.email}
            onChange={(event) => setProfile({ ...profile, email: event.target.value })}
          />
        </label>
        <label>
          Número de telefone
          <input
            type="tel"
            value={profile.phone}
            onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
            placeholder="(00) 00000-0000"
          />
        </label>
        <label>
          Senha
          <span className="protected-password">
            <span>••••••••••</span>
            <ShieldCheck />
          </span>
        </label>
        <div className="password-security-note">
          <ShieldCheck />
          <p>
            Por segurança, sua senha não pode ser visualizada ou enviada por e-mail. Para alterá-la,
            enviaremos um código de segurança ao seu e-mail.
          </p>
        </div>
        <button
          className="password-recovery-button"
          type="button"
          onClick={() => onRecoverPassword(profile.email)}
        >
          <KeyRound /> Enviar código para alterar senha
        </button>
        <button className="primary-button" type="submit">
          Salvar meus dados
        </button>
      </form>
    </section>
  )
}

type EmergencyContact = {
  id: number
  name: string
  relation: string
  phone: string
  whatsapp: boolean
}

const defaultContacts: EmergencyContact[] = []

function readContacts(): EmergencyContact[] {
  const saved = storage.getItem('teapoia-emergency-contacts')
  if (!saved) return defaultContacts
  try {
    return JSON.parse(saved)
  } catch {
    return defaultContacts
  }
}

function EmergencyContactsScreen({ toast }: { toast: (message: string) => void }) {
  const [contacts, setContacts] = useState<EmergencyContact[]>(readContacts)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    relation: '',
    phone: '',
    whatsapp: true,
  })

  useEffect(() => {
    storage.setItem('teapoia-emergency-contacts', JSON.stringify(contacts))
  }, [contacts])

  function addContact(event: React.FormEvent) {
    event.preventDefault()
    setContacts((current) => [...current, { id: Date.now(), ...draft }])
    setDraft({ name: '', relation: '', phone: '', whatsapp: true })
    setAdding(false)
    toast('Contato de emergência adicionado.')
  }

  return (
    <section className="profile-editor-screen">
      <div className="screen-heading compact-heading">
        <h1>Contatos de emergência</h1>
        <p>Cadastre pessoas de confiança para acessar rapidamente quando precisar.</p>
      </div>
      <div className="managed-contact-list">
        {contacts.map((contact) => (
          <article key={contact.id}>
            <span className="contact-avatar avatar-blue">
              <User />
            </span>
            <span>
              <strong>{contact.name}</strong>
              <small>
                {contact.relation} {contact.phone && `· ${contact.phone}`}
              </small>
            </span>
            <button
              onClick={() =>
                setContacts((current) => current.filter((item) => item.id !== contact.id))
              }
              aria-label={`Apagar contato ${contact.name}`}
            >
              <Trash2 />
            </button>
          </article>
        ))}
      </div>
      {!adding ? (
        <button className="add-message-button" onClick={() => setAdding(true)}>
          <Plus /> Adicionar contato
        </button>
      ) : (
        <form className="register-form contact-form" onSubmit={addContact}>
          <label>
            Nome
            <input
              required
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="Nome da pessoa"
            />
          </label>
          <label>
            Relação com você
            <input
              required
              value={draft.relation}
              onChange={(event) => setDraft({ ...draft, relation: event.target.value })}
              placeholder="Ex.: familiar, amizade, profissional de saúde"
            />
          </label>
          <label>
            Telefone
            <input
              required
              type="tel"
              value={draft.phone}
              onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
              placeholder="(00) 00000-0000"
            />
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={draft.whatsapp}
              onChange={(event) => setDraft({ ...draft, whatsapp: event.target.checked })}
            />
            Este número possui WhatsApp
          </label>
          <div className="form-button-row">
            <button className="soft-button" type="button" onClick={() => setAdding(false)}>
              Cancelar
            </button>
            <button className="primary-button" type="submit">
              Salvar contato
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

function CommunicationPreferencesScreen({ toast }: { toast: (message: string) => void }) {
  const saved = storage.getItem('teapoia-communication-preferences')
  const [preferences, setPreferences] = useState<{
    method: 'message' | 'call' | 'whatsapp'
    audio: boolean
    shortText: boolean
    askBeforeCall: boolean
  }>(() =>
    saved
      ? JSON.parse(saved)
      : {
          method: 'message',
          audio: true,
          shortText: true,
          askBeforeCall: true,
        },
  )

  function save() {
    storage.setItem('teapoia-communication-preferences', JSON.stringify(preferences))
    toast('Preferências de comunicação salvas.')
  }

  return (
    <section className="profile-editor-screen communication-screen">
      <div className="screen-heading compact-heading">
        <h1>Preferências de comunicação</h1>
        <p>Escolha como você prefere receber apoio e entrar em contato.</p>
      </div>
      <fieldset className="preference-group">
        <legend>Forma de contato preferida</legend>
        {[
          ['message', 'Mensagem de texto', <MessagesSquare />],
          ['call', 'Ligação', <Phone />],
          ['whatsapp', 'WhatsApp', <MessageCircle />],
        ].map(([value, label, icon]) => (
          <label key={String(value)}>
            <span>{icon as React.ReactNode}</span>
            <strong>{label as string}</strong>
            <input
              type="radio"
              name="contact-method"
              checked={preferences.method === value}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  method: value as typeof preferences.method,
                })
              }
            />
          </label>
        ))}
      </fieldset>
      <fieldset className="preference-group support-preferences">
        <legend>Quando falar estiver difícil</legend>
        <label>
          <span>
            <Volume2 />
          </span>
          <span>
            <strong>Permitir reprodução em áudio</strong>
            <small>O app pode ler a mensagem escolhida.</small>
          </span>
          <input
            type="checkbox"
            checked={preferences.audio}
            onChange={(event) => setPreferences({ ...preferences, audio: event.target.checked })}
          />
        </label>
        <label>
          <span>
            <MessagesSquare />
          </span>
          <span>
            <strong>Priorizar mensagens curtas</strong>
            <small>Mostrar primeiro opções com menos texto.</small>
          </span>
          <input
            type="checkbox"
            checked={preferences.shortText}
            onChange={(event) =>
              setPreferences({
                ...preferences,
                shortText: event.target.checked,
              })
            }
          />
        </label>
        <label>
          <span>
            <Phone />
          </span>
          <span>
            <strong>Perguntar antes de ligar</strong>
            <small>Evita iniciar chamadas por engano.</small>
          </span>
          <input
            type="checkbox"
            checked={preferences.askBeforeCall}
            onChange={(event) =>
              setPreferences({
                ...preferences,
                askBeforeCall: event.target.checked,
              })
            }
          />
        </label>
      </fieldset>
      <button className="primary-button communication-save" onClick={save}>
        Salvar preferências
      </button>
    </section>
  )
}

function AppearanceScreen({
  theme,
  setTheme,
  fontScale,
  setFontScale,
  contrast,
  setContrast,
}: {
  theme: Theme
  setTheme: (theme: Theme) => void
  fontScale: number
  setFontScale: (scale: number) => void
  contrast: 'standard' | 'high' | 'soft'
  setContrast: (contrast: 'standard' | 'high' | 'soft') => void
}) {
  const modes: {
    id: Theme
    title: string
    subtitle: string
    icon: React.ReactNode
  }[] = [
    {
      id: 'light',
      title: 'Modo claro',
      subtitle: 'Visual padrão e mais iluminado',
      icon: <Sun />,
    },
    {
      id: 'dark',
      title: 'Modo escuro',
      subtitle: 'Visual mais suave para ambientes com pouca luz',
      icon: <Moon />,
    },
    {
      id: 'reading',
      title: 'Modo leitura',
      subtitle: 'Visual simplificado e com menos estímulos',
      icon: <BookOpen />,
    },
  ]

  return (
    <section className="appearance-screen">
      <div className="screen-heading compact-heading">
        <h1>Aparência e acessibilidade</h1>
        <p>Escolha como o TEApoia aparece para você.</p>
      </div>
      <div className="mode-list">
        {modes.map((mode) => (
          <button
            className={theme === mode.id ? 'selected' : ''}
            onClick={() => setTheme(mode.id)}
            key={mode.id}
          >
            <span>{mode.icon}</span>
            <span>
              <strong>{mode.title}</strong>
              <small>{mode.subtitle}</small>
            </span>
            {theme === mode.id && <Check />}
          </button>
        ))}
      </div>
      <div className="accessibility-control">
        <strong>Tamanho da fonte</strong>
        <div className="font-slider">
          <button onClick={() => setFontScale(Math.max(0.9, fontScale - 0.1))}>A</button>
          <input
            type="range"
            min="0.9"
            max="1.2"
            step="0.1"
            value={fontScale}
            onChange={(event) => setFontScale(Number(event.target.value))}
            aria-label="Tamanho da fonte"
          />
          <button onClick={() => setFontScale(Math.min(1.2, fontScale + 0.1))}>A+</button>
        </div>
      </div>
      <div className="accessibility-control">
        <strong>Contraste</strong>
        <div className="contrast-options">
          <button
            className={contrast === 'standard' ? 'selected' : ''}
            onClick={() => setContrast('standard')}
          >
            <span /> Padrão
          </button>
          <button
            className={contrast === 'high' ? 'selected' : ''}
            onClick={() => setContrast('high')}
          >
            Alto contraste
          </button>
          <button
            className={contrast === 'soft' ? 'selected' : ''}
            onClick={() => setContrast('soft')}
          >
            Contraste suave
          </button>
        </div>
      </div>
    </section>
  )
}

export default App

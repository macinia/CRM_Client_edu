import { defineStore } from 'pinia'
import { useEmployersStore } from '@/stores/employers'

const AUTH_ACCOUNTS_KEY = 'crm_auth_accounts'
const AUTH_SESSION_KEY = 'crm_auth_session'
const EMPLOYEE_DEFAULT_PASSWORD = '123456'

const now = () => new Date().toISOString()

const createId = (prefix = 'id') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

const normalizeEmail = (email = '') => email.trim().toLowerCase()

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const useAuthStore = defineStore('AuthStore', {
  state: () => ({
    user: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user?.accountId),
    currentRole: (state) => state.user?.role || null,
  },

  actions: {
    getAccounts() {
      return readJson(AUTH_ACCOUNTS_KEY, [])
    },

    setAccounts(accounts) {
      writeJson(AUTH_ACCOUNTS_KEY, accounts)
    },

    getSession() {
      return readJson(AUTH_SESSION_KEY, null)
    },

    setSession(session) {
      writeJson(AUTH_SESSION_KEY, session)
    },

    clearSession() {
      localStorage.removeItem(AUTH_SESSION_KEY)
      this.user = null
    },

    buildOwnerSession(account) {
      return {
        accountId: account.id,
        authType: 'account',
        employeeId: null,
        role: account.role,
        email: account.email,
        surname: account.surname,
        name: account.name,
        patronymic: account.patronymic || '',
        phone: account.phone || '',
        organizationId: account.organizationId || null,
        status: 'active',
      }
    },

    buildEmployeeSession(account, employee) {
      if (!employee || employee.status !== 'active') {
        return null
      }

      return {
        accountId: account.id,
        authType: 'employee',
        employeeId: employee.id,
        role: employee.role,
        email: employee.email,
        surname: employee.surname,
        name: employee.name,
        patronymic: employee.patronymic || '',
        phone: employee.phone || '',
        organizationId: employee.organizationId || null,
        status: employee.status,
        color: employee.color || '',
      }
    },

    buildSessionFromAccount(account) {
      if (!account) return null

      if (account.type === 'employee') {
        const employersStore = useEmployersStore()
        const employee = employersStore.employers.find((item) => item.id === account.employeeId)
        return this.buildEmployeeSession(account, employee)
      }

      return this.buildOwnerSession(account)
    },

    syncEmployeeAccounts() {
      const employersStore = useEmployersStore()
      const employees = Array.isArray(employersStore.employers) ? employersStore.employers : []
      const currentAccounts = this.getAccounts()

      const nonEmployeeAccounts = currentAccounts.filter((account) => account.type !== 'employee')

      const employeeAccounts = employees
        .filter((employee) => employee.email?.trim())
        .map((employee) => {
          const existingAccount = currentAccounts.find(
            (account) => account.type === 'employee' && account.employeeId === employee.id,
          )

          return {
            id: existingAccount?.id || createId('auth'),
            type: 'employee',
            employeeId: employee.id,
            email: normalizeEmail(employee.email),
            password: existingAccount?.password || EMPLOYEE_DEFAULT_PASSWORD,
            role: employee.role,
            organizationId: employee.organizationId || null,
            status: employee.status || 'active',
            createdAt: existingAccount?.createdAt || now(),
            updatedAt: now(),
          }
        })

      const nextAccounts = [...nonEmployeeAccounts, ...employeeAccounts]
      this.setAccounts(nextAccounts)

      return nextAccounts
    },

    async registerUser(userData) {
      this.syncEmployeeAccounts()

      const accounts = this.getAccounts()
      const email = normalizeEmail(userData.email)

      const duplicateOwner = accounts.find(
        (account) => account.type === 'account' && normalizeEmail(account.email) === email,
      )

      if (duplicateOwner) {
        return {
          success: false,
          message: 'Пользователь с таким email уже зарегистрирован',
        }
      }

      const newAccount = {
        id: createId('auth'),
        type: 'account',
        email,
        password: userData.password,
        role: userData.role || 'admin',
        surname: userData.surname?.trim() || '',
        name: userData.name?.trim() || '',
        patronymic: userData.patronymic?.trim() || '',
        phone: userData.phone?.trim() || '',
        organizationId: userData.organizationId || null,
        createdAt: now(),
        updatedAt: now(),
      }

      const nextAccounts = [...accounts, newAccount]
      this.setAccounts(nextAccounts)

      const session = this.buildOwnerSession(newAccount)
      this.setSession(session)
      this.user = session

      return {
        success: true,
        user: session,
      }
    },

    async authUser(authData) {
      this.syncEmployeeAccounts()

      const accounts = this.getAccounts()
      const email = normalizeEmail(authData.email)
      const password = authData.password

      const account = accounts.find(
        (item) => normalizeEmail(item.email) === email && item.password === password,
      )

      if (!account) {
        return {
          success: false,
          message: 'Неверный email или пароль',
        }
      }

      const session = this.buildSessionFromAccount(account)

      if (!session) {
        return {
          success: false,
          message: 'Аккаунт недоступен для входа',
        }
      }

      this.setSession(session)
      this.user = session

      return {
        success: true,
        user: session,
      }
    },

    initAuth() {
      this.syncEmployeeAccounts()

      const savedSession = this.getSession()

      if (!savedSession?.accountId) {
        this.user = null
        this.initialized = true
        return false
      }

      const accounts = this.getAccounts()
      const account = accounts.find((item) => item.id === savedSession.accountId)

      if (!account) {
        this.clearSession()
        this.initialized = true
        return false
      }

      const freshSession = this.buildSessionFromAccount(account)

      if (!freshSession) {
        this.clearSession()
        this.initialized = true
        return false
      }

      this.setSession(freshSession)
      this.user = freshSession
      this.initialized = true

      return true
    },

    logout() {
      this.clearSession()
    },

    setEmployeePassword(employeeId, newPassword) {
      const accounts = this.getAccounts()

      const nextAccounts = accounts.map((account) => {
        if (account.type === 'employee' && account.employeeId === employeeId) {
          return {
            ...account,
            password: newPassword,
            updatedAt: now(),
          }
        }

        return account
      })

      this.setAccounts(nextAccounts)

      if (this.user?.employeeId === employeeId) {
        this.initAuth()
      }
    },
  },
})

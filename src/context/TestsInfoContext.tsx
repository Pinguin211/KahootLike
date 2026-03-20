import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { TestsInfo, TestsInfoEntry } from '../types/testsInfo'
import { getPublicUrl } from '../config/publicUrl'

interface TestsInfoContextValue {
  testsInfo: TestsInfo | null
  tests: TestsInfoEntry[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

export const TestsInfoContext = createContext<TestsInfoContextValue | null>(null)

function isTestsInfo(value: unknown): value is TestsInfo {
  if (!value || typeof value !== 'object') return false
  const obj = value as { tests?: unknown }
  if (!Array.isArray(obj.tests)) return false

  return obj.tests.every((entry) => {
    if (!entry || typeof entry !== 'object') return false
    const e = entry as { type?: unknown; dir?: unknown; img_url?: unknown; tests?: unknown }
    return (
      typeof e.type === 'string' &&
      typeof e.dir === 'string' &&
      typeof e.img_url === 'string' &&
      Array.isArray(e.tests) &&
      e.tests.every((t) => typeof t === 'string')
    )
  })
}

export function TestsInfoProvider({ children }: { children: ReactNode }) {
  const [testsInfo, setTestsInfo] = useState<TestsInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(getPublicUrl('testsInfo.json'))
      if (!res.ok) {
        throw new Error(`Impossible de charger testsInfo.json : ${res.status} ${res.statusText}`)
      }

      const raw = (await res.json()) as unknown
      if (!isTestsInfo(raw)) {
        throw new Error(`Format testsInfo.json invalide`)
      }

      setTestsInfo(raw)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erreur inconnue'
      setError(message)
      setTestsInfo(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const value = useMemo<TestsInfoContextValue>(() => {
    return {
      testsInfo,
      tests: testsInfo?.tests ?? [],
      loading,
      error,
      reload,
    }
  }, [testsInfo, loading, error, reload])

  return <TestsInfoContext.Provider value={value}>{children}</TestsInfoContext.Provider>
}

export function useTestsInfo() {
  const ctx = useContext(TestsInfoContext)
  if (!ctx) throw new Error('useTestsInfo doit être utilisé dans TestsInfoProvider')
  return ctx
}


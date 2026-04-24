import type { VBase } from '@vtex/api'
import { randomBytes } from 'crypto'

const BUCKET = 'config'
const STATE_KEY = 'catalogSyncState'
const LOCK_MAX_AGE_MINUTES = 15

interface SyncState {
  lockId: string | null
  lockAcquiredAt: number | null
  lastSyncAt: number | null
}

export interface LockHandle {
  lockId: string
}

const defaultState: SyncState = {
  lastSyncAt: null,
  lockAcquiredAt: null,
  lockId: null,
}

function generateLockId(): string {
  return randomBytes(16).toString('hex')
}

function isLockStale(acquiredAt: number | null): boolean {
  if (!acquiredAt) { return true }
  const ageMinutes = (Date.now() - acquiredAt) / 1000 / 60

  return ageMinutes >= LOCK_MAX_AGE_MINUTES
}

function extractEtag(headers: Record<string, string>): string | null {
  return headers.etag ?? headers.ETag ?? headers.Etag ?? null
}

async function readStateWithEtag(
  vbase: VBase
): Promise<{ state: SyncState; etag: string | null }> {
  try {
    const response = await vbase.getRawJSON<SyncState>(BUCKET, STATE_KEY)

    return {
      etag: extractEtag(response.headers),
      state: { ...defaultState, ...response.data },
    }
  } catch (error) {
    if (error.response?.status === 404) {
      return { state: { ...defaultState }, etag: null }
    }

    throw error
  }
}

async function writeStateCAS(
  vbase: VBase,
  state: SyncState,
  ifMatch: string | null
): Promise<boolean> {
  try {
    await vbase.saveJSON(
      BUCKET,
      STATE_KEY,
      state,
      undefined,
      ifMatch ?? undefined
    )

    return true
  } catch (error) {
    if (error.response?.status === 412) { return false }
    throw error
  }
}

export async function acquireLock(
  vbase: VBase,
  minIntervalMinutes: number
): Promise<LockHandle | null> {
  const { state, etag } = await readStateWithEtag(vbase)

  if (state.lockId && !isLockStale(state.lockAcquiredAt)) { return null }

  if (state.lastSyncAt) {
    const minutesSince = (Date.now() - state.lastSyncAt) / 1000 / 60

    if (minutesSince < minIntervalMinutes) { return null }
  }

  const lockId = generateLockId()
  const success = await writeStateCAS(
    vbase,
    {
      ...state,
      lockAcquiredAt: Date.now(),
      lockId,
    },
    etag
  )

  if (!success) { return null }

  return { lockId }
}

export async function releaseLock(
  vbase: VBase,
  handle: LockHandle,
  options: { markSynced: boolean } = { markSynced: true }
): Promise<void> {
  const { state, etag } = await readStateWithEtag(vbase)

  if (state.lockId !== handle.lockId) { return }

  await writeStateCAS(
    vbase,
    {
      ...state,
      lastSyncAt: options.markSynced ? Date.now() : state.lastSyncAt,
      lockAcquiredAt: null,
      lockId: null,
    },
    etag
  )
}

export async function getStateSnapshot(vbase: VBase) {
  const { state } = await readStateWithEtag(vbase)
  const lockStale = isLockStale(state.lockAcquiredAt)
  const minutesSinceLastSync = state.lastSyncAt
    ? (Date.now() - state.lastSyncAt) / 1000 / 60
    : null
  const lockAgeMinutes = state.lockAcquiredAt
    ? (Date.now() - state.lockAcquiredAt) / 1000 / 60
    : null

  return {
    lastSyncAt: state.lastSyncAt
      ? new Date(state.lastSyncAt).toISOString()
      : null,
    lockAcquiredAt: state.lockAcquiredAt
      ? new Date(state.lockAcquiredAt).toISOString()
      : null,
    lockAgeMinutes,
    lockId: state.lockId,
    lockStale,
    minutesSinceLastSync,
    now: new Date().toISOString(),
  }
}

export async function resetState(vbase: VBase): Promise<void> {
  await vbase.saveJSON(BUCKET, STATE_KEY, { ...defaultState })
}

export async function getMinutesSinceLastSync(
  vbase: VBase
): Promise<number | null> {
  const { state } = await readStateWithEtag(vbase)

  if (!state.lastSyncAt) { return null }

  return (Date.now() - state.lastSyncAt) / 1000 / 60
}

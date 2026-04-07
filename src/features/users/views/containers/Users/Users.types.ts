import type { usePresenter } from './hooks/usePresenter'
import type { useController } from './hooks/useController'

export type PresenterResult = ReturnType<typeof usePresenter>
export type ControllerResult = ReturnType<typeof useController>

import { makeAutoObservable, runInAction } from "mobx";
import { FC } from "react";

const hydrateFlag = makeAutoObservable<{ hydrate: Map<Function, boolean> }>({
  hydrate: new Map
})

export function hydrateOnce(key: FC<any>, fn: () => void) {
  runInAction(() => {
    if (hydrateFlag.hydrate.has(key))
      return

    fn()
    hydrateFlag.hydrate.set(key, true)
  })
}

export function hydrate(fn: () => void) {
  runInAction(fn)
}
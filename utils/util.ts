export function isNullOrUndefined(o: any): o is null | undefined {
  return o === null || o === void 0
}

export function asyncDebounce<T, R>(fn: (...args: T[]) => R, wait = 200) {
  let timer: any = null
  return (...args: T[]) => {
    return new Promise(async (resolve) => {
      if (timer) {
        clearTimeout(timer)
        timer = setTimeout(async () => {
          resolve(await fn(...args))
          clearTimeout(timer)
        }, wait)
      } else {
        resolve(await fn(...args))
      }
    })
  }
}
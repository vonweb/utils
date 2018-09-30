const calcFib = (function () {
  let result = 0
  let ricID: number
  let lastNumber: number
  let i = 2
  let first = 1
  let second = 1
  let resolve: any
  const ricFib: RequestIdleCallback = (deadline) => {
    // if (lastNumber < 2) {
    //   return
    // }
    for (; i <= lastNumber; i++) {
      if (deadline.timeRemaining() > 0) {
        result = first + second
        first = second
        second = result
      } else {
        console.log('================')
        ricID = window.requestIdleCallback(ricFib)
        return
      }
      // console.log(i)
      if (i === lastNumber) {
        resolve(result)
        return
      }
    }
  }
  return (num: number) => {
    if (num !== lastNumber) {
      i = 2
      first = 1
      second = 1
      lastNumber = num
      ricID && window.cancelIdleCallback(ricID)
      return new Promise(res => {
        resolve = res
        ricID = window.requestIdleCallback(ricFib)
      })
    } else {
      return Promise.reject(`same num ${num}`)
    }
  }
})()

interface RequestIdleCallback {
  (deadline: {timeRemaining: () => number, didTimeout: boolean}): void
}
interface Window {
  requestIdleCallback(cb: RequestIdleCallback, options?: {timeout: number}): number
  cancelIdleCallback(handle: number): void
}

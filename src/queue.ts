class Queue {
  _queue: any[] = []
  _concurrency = 0
  constructor (public _limit = 3) {}

  pop () {
    // 并发数达到限制
    if (this._concurrency >= this._limit) {
      return
    }

    const next = this._queue.shift()
    const _handleNext = (e?: Error) => {
      console.log('-----complete', this._concurrency, this._queue.length)
      e && console.log('error', e)
      this._concurrency--
      this.pop()
    }
    if (next) {
      this._concurrency++

      // 队列中任务完成不论成功失败，都开始执行下个任务
      Promise.resolve(next()).then(() => _handleNext(), _handleNext)
    }
  }

  push (p: any) {
    // 增加队列任务
    console.log('++++++push', this._concurrency, this._queue.length)
    this._queue.push(p)
    // 触发任务执行
    this.pop()
    return this
  }
}

const queue = new Queue(4)


for (let i = 0; i < 30; i++) {
  queue.push(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > .3) {
          resolve(`resolve ${i}: ${Date.now()}`)
        } else {
          reject(`reject ${i}: ${Date.now()}`)
        }
      }, 2000)
    }).then(res => {
      console.log(res)
    }, e => {
      console.log(e)
    })
  })
}

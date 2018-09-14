class Queue {
  _queue: any[] = []
  _courrency = 0
  constructor (public _limit = 3) {}

  pop () {
    if (this._courrency >= this._limit) {
      return
    }

    const next = this._queue.shift()
    const _handleNext = (e?: Error) => {
      console.log('-----complete', this._courrency, this._queue.length)
      e && console.log('error', e)
      this._courrency--
      this.pop()
    }
    if (next) {
      this._courrency++

      Promise.resolve(next()).then(() => _handleNext(), _handleNext)
    }
  }

  push (p: any) {
    console.log('++++++push', this._courrency, this._queue.length)
    this._queue.push(p)
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

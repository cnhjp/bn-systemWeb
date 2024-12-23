export default class SeatHistory {
  constructor() {
    this.historyStore = []
    this.historyIndex = -1
    this.saveIndex = 0
    this.maxHistory = 10
    this.count = 0
  }
  add(history) {
    this.count++
    history.count = this.count

    const newHistory = JSON.parse(JSON.stringify(history))
    if (this.historyIndex < 0) {
      this.historyStore.push(newHistory)
      this.historyIndex++
    } else {
      if (this.historyIndex == (this.historyStore.length - 1)) {
        this.historyStore.push(newHistory)
        this.historyIndex++
      } else {
        this.historyStore.splice(this.historyIndex + 1, 100)
        this.historyStore.push(newHistory)
        this.historyIndex++
      }
    }
    if (this.historyStore.length > this.maxHistory) {
      this.historyStore.shift()
      this.historyIndex--
    }
  }
  hasBack() {
    return this.historyStore.length > 1 && this.historyIndex > 0
  }
  hasPrev() {
    return this.historyStore.length > 1 && this.historyStore.length > this.historyIndex + 1
  }
  // 后退
  back() {
    if (this.historyStore.length == 0 || this.historyIndex == 0) return false
    this.historyIndex--
  }
  // 前进
  prev() {
    if (this.historyStore.length == 0 || this.historyIndex == this.historyStore.length - 1) return false
    this.historyIndex++
  }
  // 获取记录
  getHistory() {
    if (this.historyIndex < 0 || this.historyIndex >= this.historyStore.length) {
      return false
    } else {
      return JSON.parse(JSON.stringify(this.historyStore[this.historyIndex]))
    }
  }
  // 设置当前保存的step
  save() {
    this.saveIndex = this.historyIndex
  }
  // 获取当前Index
  hasChange() {
    return this.historyIndex !== this.saveIndex
  }
  getLength() {
    return this.historyStore.length
  }
  reset() {
    this.historyStore = []
    this.historyIndex = -1
    this.saveIndex = 0
    this.count = 0
  }
}

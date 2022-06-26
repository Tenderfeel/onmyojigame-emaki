import { defineStore } from 'pinia'
import moment from 'moment'

moment.locale('ja');

const STORAGE_KEY = "onmyojigame.emaki";

export const defaultLog = {
  date: new Date(),
  server: 0,
  small: 0,
  medium: 0,
  large: 0,
  used: false,
  charge: false,
  active: false
}

export type ServerData = {
  [key:number]: number
}

export type Log = {
  date: Date
  small: number
  medium: number
  large: number
  // 課金のフラグ
  charge: boolean
  // 消費のフラグ
  used: boolean
  // 消費先サーバー番号
  server: number
  active: boolean
}

export type PartsData = {
  small : number
  medium: number
  large: number
}

function getStorage(key: string, initialValue: number | Log[] | ServerData) {
  const data = localStorage.getItem(key)
  if (data === undefined || data === null) {
    return initialValue
  }
  return JSON.parse(data)
}


export const useStore = defineStore('main', {
  state: () => {
    return {
      // 小
      small: getStorage(`${STORAGE_KEY}.small`, 0),
      // 中
      medium: getStorage(`${STORAGE_KEY}.medium`, 0),
      // 大
      large: getStorage(`${STORAGE_KEY}.large`, 0),
      // ログ
      logs: getStorage(`${STORAGE_KEY}.logs`, []),
    }
  },
  getters: {
    /**
     * ポイント合計
     */
    total: (state) =>  state.small * 10 + state.medium * 20 + state.large * 100,

    /**
     * サーバーごとのポイント合計
     */
    server (state) {
      const map: ServerData = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0
      }

      this.logs
      .filter((log: Log) => log.used)
        .reduce((acc: ServerData, cur: Log) => {
          acc[cur.server] += cur.small * 10 + cur.medium * 20 + cur.large * 100
          return acc
        }, map)

      return map
    },

    /**
     * 本日獲得数
     */
    dayTotal(): PartsData {
      const todayLogs =  this.logs.filter((log: Log) => moment(log.date).isSame(moment(), 'day') && !log.used && !log.charge )
      const lastYesterdayLog = this.logs.filter((log: Log) => !log.used && !log.charge)[todayLogs.length]
      
      return todayLogs.reduce((acc: PartsData, cur: Log, index: number, logs: Log[]) => {
          const next = logs[index + 1] || lastYesterdayLog
          acc.small += cur.small - next.small
          acc.medium += cur.medium - next.medium
          acc.large += cur.large - next.large
          return acc
        }, {
          small: 0,
          medium: 0,
          large: 0
        })
    },

    /**
     * 本日課金分
     */
    chargeTotal(): PartsData {
      return this.logs.filter((log: Log) => moment(log.date).isSame(moment(), 'day') && !log.used && log.charge )
        .reduce((acc: PartsData, cur: Log) => {
          acc.small += cur.small
          acc.medium += cur.medium
          acc.large += cur.large
          return acc
        }, {
          small: 0,
          medium: 0,
          large: 0
        })
    },

    /**
     * ログのフォーマット
     */
    formatLogs(): Log[] {
      return this.logs.map((log: Log) => {
        log.date = new Date(log.date)
        return log
      })
    }
  },

  actions: {
    /**
     * LocalStorageへの保存
     */
    save() {
      console.log('save')
      try {
        localStorage.setItem(`${STORAGE_KEY}.small`, this.small);
        localStorage.setItem(`${STORAGE_KEY}.medium`, this.medium);
        localStorage.setItem(`${STORAGE_KEY}.large`, this.large);
        localStorage.setItem(`${STORAGE_KEY}.logs`, JSON.stringify(this.logs));
      } catch (e) {
        console.error(e);
      }
    },
    /**
     * 入力ログの追加
     */
    addInputLog() {
      this.logs.unshift({
        small: this.small,
        medium: this.medium,
        large: this.large,
        charge: false,
        used: false,
        server: 0,
        active: false,
        date: moment().toString()
      })
      this.save()
    },
    /**
     * ログの削除
     */
    deleteLog(index: number) {
      this.logs.splice(index, 1)
      this.save()
    },

    /**
     * ログの追加
     */
    addLog(log: Log) {
      this.logs.unshift(log)
      this.save()
    },

    /**
     * リセット
     */
    reset() {
      this.small = 0
      this.medium = 0
      this.large = 0
      this.logs = []
      this.save()
    }
  }
})
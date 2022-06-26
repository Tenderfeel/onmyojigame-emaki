import { defineStore } from 'pinia'
import moment from 'moment'
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  Timestamp,
} from 'firebase/firestore';

import {useUserStore} from './user'

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

/**
 * Get log data from Window.LocalStorage
 * @param key 
 * @param initialValue 
 */
function getStorage(key: string, initialValue: number | Log[] | ServerData) {
  const data = localStorage.getItem(key)
  if (data === undefined || data === null) {
    return initialValue
  }
  return JSON.parse(data)
}

type Season = {
  name: string
  startAt: Date
  endAt: Date
  period: string
}

export const useStore = defineStore('main', {
  
  state:  () => {

    // return {
    //   // 小
    //   small: getStorage(`${STORAGE_KEY}.small`, 0),
    //   // 中
    //   medium: getStorage(`${STORAGE_KEY}.medium`, 0),
    //   // 大
    //   large: getStorage(`${STORAGE_KEY}.large`, 0),
    //   // ログ
    //   logs: getStorage(`${STORAGE_KEY}.logs`, []),
    // }
    return {
      // 小
      small: 0,
      // 中
      medium: 0,
      // 大
      large: 0,
      // ログ
      logs: [] as Log[],

      currentSeason: null as Season | null
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
      return this.logs.filter((log: Log) => moment(log.date).isSame(moment(), 'day') && !log.used && !log.charge )
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
  },

  actions: {
    async setup() {
      const date = new Date()

      console.log('store, setup')
      const seasonQuery = query(
        collection(getFirestore(), 'season'), 
        where('startAt', '<=', date),
        limit(1)
      )
  
      // 絵巻シーズン
      onSnapshot(seasonQuery, (snapshot) => {
        console.log('seasonQuery')
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data()
          console.log('season', data)
          this.$patch((state) => {
            state.currentSeason = {
              name: data.name,
              period: data.period,
              startAt: (new Timestamp(data.startAt.seconds, data.startAt.nanoseconds)).toDate(),
              endAt: (new Timestamp(data.endAt.seconds, data.endAt.nanoseconds)).toDate(),
            }
          })
        })
      })

      const recentLogsQuery = query(collection(getFirestore(), 'logs'), orderBy('timestamp', 'desc'), limit(50));

      onSnapshot(recentLogsQuery, function(snapshot) {
        snapshot.docChanges().forEach(async function(change) {
          if (change.type === 'removed') {
            console.log(change.doc.id);
          } else {
            const log = change.doc.data();
            const seasonSnapshot = await getDoc(log.season);
            if (seasonSnapshot.exists()) {
              const season = seasonSnapshot.data()
              console.log('log.season', season)
            }
            console.log('log', change.doc.id, log);
          }
        });
      });
    },
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
    async addInputLog() {
      // const date = moment().toString()
      // this.logs.unshift({
      //   small: this.small,
      //   medium: this.medium,
      //   large: this.large,
      //   charge: false,
      //   used: false,
      //   server: 0,
      //   active: false,
      //   date
      // })
      // this.save()
      const timestamp = moment().toString()
      const user = useUserStore()
      try {
        await addDoc(collection(getFirestore(), 'logs'), {
          small: this.small,
          medium: this.medium,
          large: this.large,
          charge: false,
          used: false,
          server: 0,
          active: false,
          uid: user.uid,
          timestamp
        });
        return { severity:'success' as const, summary: 'Success', detail: 'ログを保存しました'}
      } catch (e) {
        console.error('Error writing new message to Firebase Database', e);

        return { severity:'error' as const, summary: 'Error', detail: 'ログの保存に失敗しました'}
      }
    },
    /**
     * ログの削除
     */
    deleteLog(index: number) {
      // this.logs.splice(index, 1)
      // this.save()
    },

    /**
     * ログの追加
     */
    addLog(log: Log) {
      // this.logs.unshift(log)
      // this.save()
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

type mainStore = ReturnType<typeof useStore>

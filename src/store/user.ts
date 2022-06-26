import type { User } from 'firebase/auth'

import { defineStore } from 'pinia'
import {
  getAuth,
} from 'firebase/auth';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      uid: '',
      profilePicUrl: '',
      userName: '',
      isSignedIn: false
    }
  },
  // getters: {
  //   isSignedIn: () => {
  //     console.log('isSignedIn',!!getAuth().currentUser)
  //   }
  // },
  actions: {
    setUser(user: User) {
      this.profilePicUrl = user.photoURL || '';
      this.userName = user.displayName || '';
      this.uid = user.uid || '';
      this.isSignedIn = true;
    }
  }
})
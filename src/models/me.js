import Model from 'ampersand-model'
import ms from 'milliseconds'
import cacheMixin from 'ampersand-local-cache-mixin'
import githubMixin from '../helpers/github-mixin'
import RepoCollection from './repo-collection'

export default Model.extend(cacheMixin, githubMixin, {
  url: 'https://api.github.com/user',

  initialize () {
    this.initStorage({
      storageKey: 'me',
      ttl: ms.days(30),
      tts: ms.minutes(10)
    })
    this.on('stale', this.onStale, this)
    this.on('change', this.writeToStorage, this)
    this.on('change:login', this.onLoginChange, this)
  },

  props: {
    token: 'string',
    login: 'string',
    'avatar_url': 'string'
  },

  derived: {
    loggedIn () {
      return !!this.token
    }
  },

  collections: {
    repos: RepoCollection
  },

  onStale () {
    if (this.loggedIn) {
      this.fetch()
    }
  },

  onLoginChange (model, val) {
    if (val) {
      this.fetch()
    } else {
      // wipe local data
      window.localStorage.clear()
    }
  }
})

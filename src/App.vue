<template>
  <div id="app">
    <router-view
      v-bind="{
        images: imageStore,
        lists: listStore,
        trackers: trackerStore,
        svgs: svgStore,
        pages
      }" />
  </div>
</template>

<script>
import EventBus from './EventBus'
import SaveableImage from '@/models/SaveableImage'
import SaveableSvg from '@/models/SaveableSvg'
import List from '@/models/List'
import Tracker from '@/models/Tracker'

export default {
  name: 'App',
  data () {
    return {
      indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
      db: null,
      pages: [],
      imageStore: [],
      listStore: [],
      trackerStore: [],
      svgStore: [],
      storeReference: {
        imageStore: {
          convert: i => new SaveableImage(i)
        }
      }
    }
  },
  watch: {
    pages (value) {
      this.$store.dispatch('updatePages', value)
    }
  },
  methods: {
    async dbAdd (storeName, value) {
        if (!value || value == null) return console.error('Invalid Value');
        console.log('adding...');
        let currentPage = this.$store.state.currentPage;
  
        let objectStore = this.db
          .transaction(storeName, "readwrite")
          .objectStore(storeName);
        let req = objectStore.add({ ...value, page: currentPage })
        
        req.onerror = (error) => console.error('Transaction Error', error)
        
        req.onsuccess = async (e) => {
          // update store with new item
          // e.target.result is the key (id)
          await this.dbPull(storeName)
          if (storeName === 'listStore' || storeName === 'trackerStore')
           EventBus.$emit('set-active-item', { storeName, id: e.target.result })
        }
    },
    async dbPull (storeName, keys = []) {
      // console.log('pulling...', storeName)
      return new Promise((res, rej) => {
        if (keys && keys.length > 0) {
          // pull specific values by key (i.e. id)
          for (const key of keys) {
            this.db.transaction(storeName)
              .objectStore(storeName)
              .get(key)
              .onsuccess = (e) => {
                // let result = e.target.result;
            };
          }
        } else {
          // pull all
          let transaction = this.db.transaction(storeName)
            .objectStore(storeName)
            .getAll()
            .onsuccess = async (e) => {
              // console.log('pulled', storeName)
              if (storeName === 'imageStore') {
                this.imageStore = e.target.result.map(x => new SaveableImage(x));
              }
              if (storeName === 'listStore') {
                this.listStore = e.target.result
                  .map(x => new List({ page: x.page, id: x.id, position: { x: x.x, y: x.y }, items: x.items }))
              }
              if (storeName === 'trackerStore') {
                this.trackerStore = e.target.result
                  .map(x => new Tracker({ page: x.page, id: x.id, position: { x: x.x, y: x.y }, items: x.items, options: x.options }))
              }
              if (storeName === 'svgStore') {
                this.svgStore = e.target.result.map(x => new SaveableSvg(x));
              }
              
              res();
          };
        }

      })
    },
    async dbUpdate (storeName, id, value) {
      if (!id) return console.error('No ID!');

      // console.log('updating...', value)
      let objectStore = this.db.transaction(storeName, "readwrite").objectStore(storeName);
      let req = objectStore.get(id)
      
      req.onerror = (error) => console.error('Transaction Error', error)
      
      req.onsuccess = async (e) => {
        let data = {
          ...e.target.result,
          ...value
        }
        let reqUpdate = objectStore.put(data)

        reqUpdate.onerror = (error) => console.error('Update Error', error)
        reqUpdate.onsuccess = async (event) => {
            await this.dbPull(storeName) // JUST UPDATE THE KEYM, NOT WHOLE ARRAY!
        };
      }
    },
    async dbDelete (storeName, id) {
      // console.log('deleting ' + id + ' from ' + storeName);
      let objectStore = this.db
        .transaction(storeName, "readwrite")
        .objectStore(storeName);

      let req = objectStore.delete(id);

      req.onsuccess = async e => {
        await this.dbPull(storeName);
      }

      req.onerror = e => console.error('Delete error:', e);
    },
    async dbDeleteMultiple (storeName, keys) {
        let objectStore = this.db
          .transaction(storeName, "readwrite")
          .objectStore(storeName);
  
        let promiseArray = [];
  
        for (let key of keys) {
          promiseArray.push(new Promise((res, rej) => {
            let req = objectStore.delete(key);
  
            req.onsuccess = e => res();
            req.onerror = e => rej()
          }))
        }
  
        await Promise.all(promiseArray);
        await this.dbPull(storeName);
    },
    async createStore (storeName, indexes = []) {
      let objectStore = this.db
        .createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });

      for (let index of indexes) {
        objectStore.createIndex(index, index);
      }
    },
    async createStores () {
      await Promise.all([
        this.createStore('imageStore', ['page', 'x', 'y', 'src', 'width', 'height']),
        this.createStore('listStore', ['page', 'x', 'y', 'items']),
        this.createStore('trackerStore', ['page', 'x', 'y', 'items', 'options']),
        this.createStore('svgStore', ['page', 'x', 'y', 'html', 'width', 'height', 'initialWidth', 'initialHeight'])
      ])
    },
    async pullAllStores () {
      await Promise.all([
        this.dbPull('imageStore'),
        this.dbPull('listStore'),
        this.dbPull('trackerStore'),
        this.dbPull('svgStore')
      ])
    },
    initDb () {
      let req = this.indexedDB.open('BulletJournal', 1);

      req.onerror = (e) => console.error("DB Error", e);

      req.onsuccess = async (e) => {
        this.db = e.target.result;
        await this.pullAllStores();
      }

      req.onupgradeneeded = (e) => {
        this.db = e.target.result;
        this.createStores();
      }
    },
    addPage () {
      let newPage = this.pages[this.pages.length - 1].id + 1;
      this.pages.push({ id: newPage, name: 'Page ' + newPage });
      localStorage.setItem('pages', JSON.stringify(this.pages))
      this.setActivePage(newPage)
    },
    setActivePage (pageNum) {
      this.$store.dispatch('setActivePage', pageNum)
      localStorage.setItem('currentPage', JSON.stringify(pageNum))
    },
    async deletePage (pageNum) {
      let foundIndex = this.pages.findIndex(x => x.id == pageNum);
      if (foundIndex == -1) return;

      // FIND PAGE ITEMS ON THIS PAGE
      const findMatchingPage = (array) => array.filter(x => x.page === pageNum).map(x => x.id);
      let keysToDelete = {
        imageStore: findMatchingPage(this.imageStore),
        svgStore: findMatchingPage(this.svgStore),
        listStore: findMatchingPage(this.listStore),
        trackerStore: findMatchingPage(this.trackerStore),
      }

      // DELETE PAGE ITEMS FROM DB STORES
      let promiseArray = [];
      for (let key in keysToDelete) {
        promiseArray.push(this.dbDeleteMultiple(key, keysToDelete[key]))
      }

      await Promise.all(promiseArray);

      // DELETE PAGE
      this.pages.splice(foundIndex, 1);
      localStorage.setItem('pages', JSON.stringify(this.pages))

      let activePage = localStorage.getItem('currentPage');
      if (activePage == pageNum)
        this.setActivePage(this.pages[this.pages.length - 1].id);
    },
    renamePage ({ id, value }) {
      let pageIndex = this.pages.findIndex(x => x.id === id);

      if (pageIndex < 0) return;

      this.pages[pageIndex].name = value;

      localStorage.setItem('pages', JSON.stringify(this.pages))
    }
  },
  async created () {
    EventBus.$on('pages:add', this.addPage);
    EventBus.$on('pages:activate', e => this.setActivePage(e));
    EventBus.$on('pages:rename', e => this.renamePage(e));
    EventBus.$on('pages:delete', async e => this.deletePage(e));

    EventBus.$on('dbup:add', async ({ storeName, value }) => {
      await this.dbAdd(storeName, value);
    })
    EventBus.$on('dbup:update', async ({ storeName, id, value }) => {
      await this.dbUpdate(storeName, id, value);
    })
    EventBus.$on('dbup:delete', async ({ storeName, id }) => {
      await this.dbDelete(storeName, id);
    })
  },
  async mounted () {
    let pages = localStorage.getItem('pages');
    let currentPage = localStorage.getItem('currentPage')

    if (pages) {
      this.pages = JSON.parse(pages)
    } else {
      let newPageArr = [ { id: 1, name: 'Page 1' } ];
      localStorage.setItem('pages', JSON.stringify(newPageArr));
      this.pages = newPageArr;
    }

    currentPage && pages && pages.includes(currentPage)
      ? this.$store.dispatch('setActivePage', JSON.parse(currentPage))
      : this.setActivePage(1);

    await this.initDb();
  }
}
</script>

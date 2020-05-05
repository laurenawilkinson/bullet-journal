<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    </div>
    <router-view
      v-bind="{
        images: imageStore,
        lists: listStore,
        trackers: trackerStore,
        svgs: svgStore
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
  methods: {
    async dbAdd (storeName, value) {
        console.log('adding to ', storeName);
        if (!value || value == null) return console.error('Invalid Value');
  
        let objectStore = this.db
          .transaction(storeName, "readwrite")
          .objectStore(storeName);
        let req = objectStore.add(value)
        
        req.onerror = (error) => console.error('Transaction Error', error)
        
        req.onsuccess = async (e) => {
          // update store with new item
          // e.target.result is the key (id)
          await this.dbPull(storeName)
          EventBus.$emit('set-active-item', { storeName, id: e.target.result })
        }
    },
    async dbPull (storeName, keys = []) {
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
              if (storeName === 'imageStore') {
                this.imageStore = e.target.result.map(x => new SaveableImage(x));
              }
              if (storeName === 'listStore') {
                this.listStore = e.target.result
                  .map(x => new List({ id: x.id, position: { x: x.x, y: x.y }, items: x.items }))
              }
              if (storeName === 'trackerStore') {
                this.trackerStore = e.target.result
                  .map(x => new Tracker({ id: x.id, position: { x: x.x, y: x.y }, items: x.items, options: x.options }))
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

      console.log('updating...', value)
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
      console.log('deleting ' + id + ' from ' + storeName);
      let objectStore = this.db
        .transaction(storeName, "readwrite")
        .objectStore(storeName);

      objectStore.delete(id);

      objectStore.onsuccess = async e => {
        await this.dbPull(storeName);
      }

      objectStore.onerror = e => console.error('Delete error:', e);
    },
    async createStore (storeName, indexes) {
      let objectStore = this.db
        .createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });

      for (let index of indexes) {
        objectStore.createIndex(index, index);
      }
    },
    async createStores () {
      await Promise.all([
        this.createStore('imageStore', ['x', 'y', 'src', 'width', 'height']),
        this.createStore('listStore', ['x', 'y', 'items']),
        this.createStore('trackerStore', ['x', 'y', 'items', 'options']),
        this.createStore('svgStore', ['x', 'y', 'html', 'width', 'height', 'initialWidth', 'initialHeight'])
      ])
    },
    async pullAllStores () {
      await Promise.all([
        this.dbPull('imageStore'),
        this.dbPull('listStore'),
        this.dbPull('trackerStore'),
        this.dbPull('svgStore')
      ])
    }
  },
  async created () {
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
  mounted () {
    let req = this.indexedDB.open('BulletJournal', 1);

    req.onerror = (e) => console.error("DB Error", e);

    req.onsuccess = (e) => {
      this.db = e.target.result;
      this.pullAllStores();
    }

    req.onupgradeneeded = (e) => {
      this.db = e.target.result;
      this.createStores();
    }
  }
}
</script>

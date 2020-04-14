<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    </div>
    <router-view
      v-bind="{
        images: imageStore
      }" />
  </div>
</template>

<script>
import EventBus from './EventBus'
import SaveableImage from '@/models/SaveableImage'

export default {
  name: 'App',
  data () {
    return {
      indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
      db: null,
      imageStore: []
    }
  },
  methods: {
    dbAdd (storeName, value) {
      let objectStore = this.db.transaction(storeName, "readwrite").objectStore(storeName);
      let req = objectStore.add(value)
      
      req.onerror = (error) => console.error('Transaction Error', error)
      
      req.onsuccess = (e) => {
        // update store with new item
        // e.target.result is the key
        this.dbPull(storeName)
      }
    },
    dbPull (storeName, keys = []) {
      if (keys && keys.length > 0) {
        // pull specific values by key (i.e. id)
        for (const key of keys) {
          this.db.transaction(storeName)
            .objectStore(storeName)
            .get(key)
            .onsuccess = (e) => {
            console.log('Result' + e.target.result);
          };
        }
      } else {
        // pull all
        this.db.transaction(storeName)
          .objectStore(storeName)
          .getAll()
          .onsuccess = (e) => {
            if (storeName === 'imageStore') {
              this.imageStore = e.target.result.map(x => {
                return new SaveableImage(x)
              });
            }
        };
      }
    },
    dbUpdate (storeName, id, value) {
      if (!id) return console.error('No ID!');

      let objectStore = this.db.transaction(storeName, "readwrite").objectStore(storeName);
      let req = objectStore.get(id)
      
      req.onerror = (error) => console.error('Transaction Error', error)
      
      req.onsuccess = (e) => {
        let data = {
          ...e.target.result,
          ...value
        }
        let reqUpdate = objectStore.put(data)

        reqUpdate.onerror = (error) => console.error('Update Error', error)
        reqUpdate.onsuccess = (event) => {
          this.dbPull(storeName) // JUST UPDATE THE KEYM, NOT WHOLE ARRAY!
        };
      }
    },
    createImageStore () {
      let objectStore = this.db
        .createObjectStore('imageStore', { keyPath: 'id', autoIncrement: true })

      objectStore.createIndex('x', 'x')
      objectStore.createIndex('y', 'y')
      objectStore.createIndex('src', 'src')
      objectStore.createIndex('width', 'width')
      objectStore.createIndex('height', 'height')
    }
  },
  created () {
    EventBus.$on('dbup:add', ({ storeName, value }) => {
      this.dbAdd(storeName, value);
    })
    EventBus.$on('dbup:update', ({ storeName, id, value }) => {
      this.dbUpdate(storeName, id, value);
    })
  },
  mounted () {
    let req = this.indexedDB.open('BulletJournal', 1);

    req.onerror = (e) => console.error("DB Error", e);

    req.onsuccess = (e) => {
      this.db = e.target.result;
      this.dbPull('imageStore');
    }

    req.onupgradeneeded = (e) => {
      this.db = e.target.result;

      this.createImageStore();
    }
  }
}
</script>

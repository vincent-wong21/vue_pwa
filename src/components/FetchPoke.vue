<script setup>

import { onMounted, reactive, ref } from 'vue';
import IndexedDB from '@/components/IndexedDB.vue';

const title = ref('Fetching pokemon data')
const items = ref([])

const url = ref('https://pokeapi.co/api/v2/pokemon')
const next = ref('')
const prev = ref('')
const data = ref([])

const fetching = ref(false)

const dataKirim = reactive({
  name: '',
  address: '',
  dob: '',
  created_date: Date
})
const fetchData = async() => {
  try {
    fetching.value = true
    const response = await fetch(url.value)
    if (!response.ok) {
      console.error('Failed to fetch data')
    }
    const data = await response.json()
    items.value = data.results
    next.value = data.next
    prev.value = data.previous
  } catch (err) {
    console.error('An error occured', err)
  } finally {
    fetching.value = false
  }
}

const nextData = async() => {
  url.value = next.value
  await fetchData()
}

const prevData = async() => {
  if (prev.value === null) return
  url.value = prev.value
  await fetchData()
}

const fetchMock = async () => {
  console.log('fetch async')
  const users = await fetch('https://65571769bd4bcef8b6120891.mockapi.io/api/v1/users')
  // const comments = await fetch('https://65571769bd4bcef8b6120891.mockapi.io/api/v1/comments')

  console.log(await users.json())
  // console.log(await comments.json())
  // data.value = await users.json() + await comments.json()
}

const fetchNoAsync = () => {
  console.log('fetch no async')
  const users = fetch('https://65571769bd4bcef8b6120891.mockapi.io/api/v1/users')
  console.log(users.json())

  const comments = fetch('https://65571769bd4bcef8b6120891.mockapi.io/api/v1/comments')
  console.log(comments.json())
}

onMounted(() => {
  fetchData()
  fetchMock()
  // fetchNoAsync()
})

const postData = async () => {
  dataKirim.created_date = new Date()
  const response = await fetch('https://65571769bd4bcef8b6120891.mockapi.io/api/v1/users', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataKirim)
  })

  if (response.status === 200) {
    console.log('success post')
  } else {
    console.error('failed post')
    console.error(response.body)
  }
}
</script>

<template>
  <div class="container my-3">
    <div class="border p-3">
      <IndexedDB/>
    </div>
    <div class="container border-1 border-black solid">
      <form @submit.prevent="postData">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control" id="nameInput" v-model="dataKirim.name">
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input type="text" class="form-control" id="address" v-model="dataKirim.address">
        </div>
        <div class="mb-3">
          <label for="dob" class="form-label">Date of Birth</label>
          <input type="text" class="form-control" id="dob" v-model="dataKirim.dob">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
    <table class="table table-bordered">
      <tr>
        <th>Name</th>
        <th>Url</th>
      </tr>
      <tr v-for="item in items" >
        <td>{{ item.name }}</td>
        <td>{{ item.url }}</td>
      </tr>
    </table>
    <div>
      <button class="btn btn-primary" type="button" :disabled="fetching" @click="prevData">
        <span v-show="fetching" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span v-if="fetching" role="status">Loading...</span>
        <span v-else role="status">Prev</span>
      </button>
<!--      <button class="btn btn-primary mr-3" @click="prevData">Previous</button>-->
<!--      <button v-if="!fetching" class="btn btn-primary" >Next</button>-->

      <button class="btn btn-primary" type="button" :disabled="fetching" @click="nextData">
        <span v-show="fetching" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span v-if="fetching" role="status">Loading...</span>
        <span v-else role="status">Next</span>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>

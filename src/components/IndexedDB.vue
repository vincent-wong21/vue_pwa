<template>
  <div>
    <h2>IndexedDB</h2>
    <form class="text-start">
      <div class="mb-3">
        <label for="ssnInput" class="form-label">SSN</label>
        <input v-model="dataInput.ssn" type="text" class="form-control" id="ssnInput" placeholder="666-66-6666">
      </div>
      <div class="mb-3">
        <label for="nameInput" class="form-label">Name</label>
        <input :disabled="readOnly" v-model="dataInput.name" type="text" class="form-control" id="nameInput" placeholder="Alice">
      </div>
      <div class="mb-3">
        <label for="ageInput" class="form-label">Age</label>
        <input :disabled="readOnly" v-model="dataInput.age" type="number" class="form-control" id="ageInput" placeholder="28">
      </div>
      <div class="mb-3">
        <label for="emailInput" class="form-label">Email</label>
        <input :disabled="readOnly" v-model="dataInput.email" type="email" class="form-control" id="emailInput" placeholder="alice@example.com">
      </div>
      <div class="mb-3">
        <label class="form-label" for="input-blob">Upload</label>
        <input @change="onFileChange" type="file" accept="image/png, image/gif, image/jpeg" class="form-control" id="input-blob">
      </div>
      <div v-if="readOnly" class="mb-3">
        <label class="form-label" for="input-blob">Image Preview</label>
        <img :src="dataInput.file"  alt="Image"/>
      </div>
    </form>
    <p>Status: {{ addedData }}</p>
    <p v-show="!!errMsg" class="text-danger">{{ errMsg }}</p>
    <div class="d-flex justify-content-center">
      <button class="btn btn-dark me-3" @click="getAll">Get All Data</button>
      <button class="btn btn-primary me-3" @click="getData">Get Data</button>
      <button class="btn btn-success me-3" @click="addData">Add Data</button>
      <button class="btn btn-warning me-3" @click="updateData">Update Data</button>
      <button class="btn btn-outline-danger me-3" @click="deleteData">Delete Data</button>
      <button class="btn btn-outline-dark" @click="resetInput">Clear</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import data from 'bootstrap/js/src/dom/data.js';

const dbName = "the_name";
// const customerToAdd = { ssn: "666-66-6666", name: "Alice", age: 28, email: "alice@example.com" };

const dataInput = reactive({
  ssn: '',
  name: '',
  age: 0,
  email: '',
  file: ''
})
const errMsg = ref('')

const addedData = ref(null);
const readOnly = ref(false)

const reader = new FileReader()

const onFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length)
    return

  reader.readAsDataURL(files[0])
}

const addData = () => {
  const request = indexedDB.open(dbName, 2);

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    const objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("email", "email", { unique: true });
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const addTransaction = db.transaction("customers", "readwrite");
    const customerObjectStore = addTransaction.objectStore("customers");

    const addRequest = customerObjectStore.add({
      ssn: dataInput.ssn,
      name: dataInput.name,
      age: dataInput.age,
      email: dataInput.email,
      file: dataInput.file
    });

    addRequest.onsuccess = (event) => {
      console.log("Data added successfully");
      addedData.value = "Data added successfully";
      resetInput()
    };

    addRequest.onerror = (event) => {
      console.error("Error adding data", event.target.error);
      addedData.value = "Error adding data";
    };

    addTransaction.oncomplete = () => {
      console.log("Add transaction completed");
      db.close();
    };
  };
};

const getData = () => {
  if (dataInput.ssn === null || dataInput.ssn.trim() === '') {
    errMsg.value = `SSN can't be empty`
    addedData.value = 'Failed to get Data'
    return
  }

  const request = indexedDB.open(dbName, 2);

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const readTransaction = db.transaction("customers", "readonly");
    const customerObjectStore = readTransaction.objectStore("customers");

    console.log(dataInput.ssn)
    const customersCursor = customerObjectStore.get(dataInput.ssn);

    customersCursor.onsuccess = (event) => {
      const result = event.target.result;

      if (result) {
        console.log(result)
        dataInput.name = result.name
        dataInput.age = result.age
        dataInput.email = result.email
        dataInput.file = result.file
        readOnly.value = true
      } else {
        console.log("No Data found");
        errMsg.value = `Data with SSN: ${dataInput.ssn}, Not Found`
      }
      db.close();
    };

    customersCursor.onerror = (event) => {
      console.error("Error reading data", event.target.error);
      db.close();
    };
  };
}

const getAll = () => {

}

const deleteData = () => {
  if (dataInput.ssn === null || dataInput.ssn.trim() === '') {
    errMsg.value = `SSN can't be empty`
    addedData.value = 'Failed to get Data'
    return
  }

  const request = indexedDB.open(dbName, 2);

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const deleteTransaction = db.transaction("customers", "readwrite");
    const deleteObjectStore = deleteTransaction.objectStore("customers");

    const deleteRequest = deleteObjectStore.delete(dataInput.ssn);

    deleteRequest.onsuccess = (event) => {
      console.log("Data deleted successfully");
      addedData.value = "Data deleted successfully";
    };

    deleteRequest.onerror = (event) => {
      console.error("Error deleting data", event.target.error);
      addedData.value = "Error deleting data, " + event.target.error;
    };

    deleteTransaction.oncomplete = () => {
      console.log("Delete transaction completed");
      db.close();
    };
  };
}

const updateData = () => {

}

const validateInput = () => {
  if (dataInput.ssn === null || dataInput.ssn.trim() === '')
    errMsg.value += 'SSN can\'t be empty'
  if (dataInput.name === null || dataInput.name.trim() === '')
    errMsg.value += 'name can\'t be empty'
}

const resetInput = () => {
  dataInput.ssn = ''
  dataInput.name = ''
  dataInput.age = 0
  dataInput.email = ''
  readOnly.value = false
  errMsg.value = ''
  addedData.value = ''
}

onMounted(() => {
  reader.addEventListener('load', () => {
    dataInput.file = reader.result
  })
})
</script>

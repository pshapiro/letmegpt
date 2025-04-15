<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const prompt = ref('')
const generatedLink = ref('')
const router = useRouter()

const generateLink = () => {
  if (!prompt.value.trim()) return
  const encodedPrompt = encodeURIComponent(prompt.value.trim())
  const domain = import.meta.env.VITE_APP_DOMAIN
  const url = `${domain}/output?p=${encodedPrompt}`
  generatedLink.value = url
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(generatedLink.value)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const viewLink = () => {
  const encodedPrompt = encodeURIComponent(prompt.value.trim())
  router.push(`/output?p=${encodedPrompt}`)
}
</script>

<template>
  <main class="home">
    <h1>Let Me ChatGPT That For You</h1>
    
    <div class="input-container">
      <input
        v-model="prompt"
        type="text"
        placeholder="Enter your prompt..."
        @keyup.enter="generateLink"
      >
      <button @click="generateLink">Show them</button>
    </div>

    <div v-if="generatedLink" class="link-container">
      <input readonly :value="generatedLink">
      <div class="actions">
        <button @click="copyLink">Copy link</button>
        <button @click="viewLink">View link</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  text-align: center;
  margin: 0;
}

.input-container {
  display: flex;
  gap: 1rem;
  width: 100%;
}

input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  outline: none;
}

input:focus {
  border-color: #646cff;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #535bf2;
}

.link-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
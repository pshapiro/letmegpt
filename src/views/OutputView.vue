<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { decodePrompt } from '../utils/crypto'

const route = useRoute()
const router = useRouter()
const prompt = ref('')
const cursorPosition = ref({ x: 0, y: 0 })
const inputRef = ref<HTMLInputElement | null>(null)
const submitRef = ref<HTMLButtonElement | null>(null)
const displayText = ref('')

onMounted(() => {
  // Get and decode the prompt from URL
  const encodedPrompt = route.query.q as string
  if (!encodedPrompt) {
    router.push('/')
    return
  }
  
  const decodedPrompt = decodePrompt(encodedPrompt)
  if (!decodedPrompt) {
    router.push('/')
    return
  }
  
  prompt.value = decodedPrompt
  
  // Start animation after a short delay
  setTimeout(() => {
    if (!inputRef.value) return
    
    // Position cursor at input
    const rect = inputRef.value.getBoundingClientRect()
    cursorPosition.value = {
      x: rect.left + 20,
      y: rect.top + rect.height / 2
    }
    
    // Type out the text
    let currentIndex = 0
    const typeInterval = setInterval(() => {
      if (currentIndex >= prompt.value.length) {
        clearInterval(typeInterval)
        moveToSubmit()
        return
      }
      
      displayText.value = prompt.value.substring(0, currentIndex + 1)
      if (inputRef.value) {
        // Scroll to end of input to show latest typed characters
        inputRef.value.scrollLeft = inputRef.value.scrollWidth
      }
      currentIndex++
    }, 100)
  }, 1000)
})

const moveToSubmit = () => {
  if (!submitRef.value) return
  
  setTimeout(() => {
    const submitRect = submitRef.value!.getBoundingClientRect()
    cursorPosition.value = {
      x: submitRect.left + submitRect.width / 2,
      y: submitRect.top + submitRect.height / 2
    }
    
    // Redirect after cursor moves to submit button
    setTimeout(() => {
      window.location.href = `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt.value)}`
    }, 500)
  }, 500)
}
</script>

<template>
  <main class="output">
    <h1>What can I help with?</h1>
    
    <div class="chat-input">
      <input
        ref="inputRef"
        type="text"
        :value="displayText"
        placeholder="Message ChatGPT..."
        readonly
      >
      <button class="mic">
        <span class="sr-only">Voice input</span>
        🎤
      </button>
      <button
        ref="submitRef"
        class="submit"
        aria-label="Send message"
      >
        ↑
      </button>
    </div>

    <div
      class="cursor"
      :style="{
        left: cursorPosition.x + 'px',
        top: cursorPosition.y + 'px'
      }"
    ></div>
  </main>
</template>

<style scoped>
.output {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #ffffff;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #000000;
}

.chat-input {
  position: relative;
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  background: transparent;
  color: #000000;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  text-overflow: clip;
  -webkit-overflow-scrolling: touch;
}

input::placeholder {
  color: #6b7280;
}

.mic, .submit {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit {
  background-color: #000000;
  color: white;
  border-radius: 0.5rem;
  width: 32px;
  height: 32px;
}

.cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  background: #646cff;
  border-radius: 50%;
  pointer-events: none;
  transition: all 0.5s ease;
  z-index: 1000;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

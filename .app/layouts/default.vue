<script setup>
import { useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'

const collapse = ref(true)

const router = useRouter()

const userName = ref('')
const userEmail = ref('')

let timer

function resetTimer() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_first_name')
    localStorage.removeItem('user_last_name')
    localStorage.removeItem('user_email')
    router.push('/login')
  }, 3600000) // 1 hora
}

onBeforeMount(() => {
  window.onload = resetTimer
  document.onmousemove = resetTimer
  document.onkeydown = resetTimer
  if (typeof window !== 'undefined') {
    const storedFirstName = localStorage.getItem('user_first_name')
    const storedLastName = localStorage.getItem('user_last_name')
    const storedEmail = localStorage.getItem('user_email')

    if (storedFirstName && storedLastName && storedEmail) {
      userName.value = storedFirstName + ' ' + storedLastName
      userEmail.value = storedEmail
    }
  }
})

const goToPage = (page) => {
  router.push(page)
}
</script>

<template>
  <TairoCollapseLayout :collapse="collapse">
    <slot />
  </TairoCollapseLayout>
</template>

<script setup lang="ts">
import { onBeforeMount, watch, ref, computed } from 'vue'
const { $axios } = useNuxtApp()

definePageMeta({
  title: 'Reports List',
  preview: {
    title: 'Reports List',
    description: 'A list of all reports',
    categories: ['layouts', 'lists'],
    src: '/img/screens/layouts-list-flex-1.png',
    srcDark: '/img/screens/layouts-list-flex-1-dark.png',
    order: 41,
  },
})

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(10)

const data = ref([])
const pagination = ref({
  count: 0,
  perPage: 10,
  currentPage: 1,
  totalPages: 0,
  next: '',
  previous: '',
})

const isModalOpen = ref(false)
const selectedReportId = ref(null)

const toaster = useToaster()

function closeModal() {
  isModalOpen.value = false
}

function openDeleteModal(userId: number) {
  selectedReportId.value = userId
  isModalOpen.value = true
}

async function fetchReports() {
  try {
    const response = await $axios.get('/reports/', {
      params: {
        filter: filter.value,
        perPage: perPage.value,
        page: page.value,
      },
    })
    data.value = response.data.results
    pagination.value = {
      count: response.data.total_items,
      totalPages: response.data.total_pages,
      currentPage: response.data.current_page,
      perPage: response.data.perPage,
      next: response.data.next ? response.data.next : null,
      previous: response.data.previous ? response.data.previous : null,
    }
  }
  catch (error: any) {
    console.error('Erro na requisição:', error)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token')
      router.push('/login')
    }
  }
}

async function deleteReportAndCloseModal() {
  isModalOpen.value = false
  try {
    const response = await $axios.delete(`/reports/${selectedReportId.value}`)
    if (response.status === 204 || response.status === 200) {
      toaster.clearAll()
      toaster.show({
        title: 'Success',
        message: `The report has been deleted!`,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })
    }
    await fetchReports()
  }
  catch (error: any) {
    if (error.response) {
      console.log(error.response)
    }
  }
}

watch([filter, perPage, page], async () => {
  await router.push({
    query: {
      filter: filter.value,
      perPage: perPage.value,
      page: page.value,
    },
  })
  fetchReports()
})

onBeforeMount(async () => {
  if (process.client) {
    if (isTokenExpired()) {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('user_first_name')
      localStorage.removeItem('user_last_name')
      localStorage.removeItem('user_email')
      router.push('/login')
      return
    }

    const token = localStorage.getItem('jwt_token')
    if (!token) {
      router.push('/login')
      return
    }

    await fetchReports()
  }
})

const onPageChange = (newPage) => {
  page.value = newPage
  fetchReports()
}

function statusColor(itemStatus: string) {
  switch (itemStatus) {
    case 'online':
      return 'success'
    case 'working':
      return 'info'
    case 'suspended':
      return 'warning'
    default:
      break
  }
}
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          placeholder="Filter reports..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseSelect
          v-model="perPage"
          label=""
          :classes="{
            wrapper: 'w-full sm:w-40',
          }"
        >
          <option :value="10">
            10 per page
          </option>
          <option :value="25">
            25 per page
          </option>
          <option :value="50">
            50 per page
          </option>
          <option :value="100">
            100 per page
          </option>
        </BaseSelect>
      </template>
      <div>
        <div v-if="data?.length === 0">
          <BasePlaceholderPage
            title="No matching results"
            subtitle="Looks like we couldn't find any matching results for your search terms. Try other search terms."
          >
            <template #image>
              <img
                class="block dark:hidden"
                src="/img/illustrations/placeholders/flat/placeholder-search-4.svg"
                alt="Placeholder image"
              >
              <img
                class="hidden dark:block"
                src="/img/illustrations/placeholders/flat/placeholder-search-4-dark.svg"
                alt="Placeholder image"
              >
            </template>
          </BasePlaceholderPage>
        </div>
        <div v-else>
          <div class="w-full">
            <TairoTable rounded="sm" :scrollable="false">
              <template #header>
                <TairoTableHeading uppercase spaced>
                  Customer
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Month
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Generated by
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Action
                </TairoTableHeading>
              </template>

              <TairoTableRow v-for="item in data" :key="item.id">
                <TairoTableCell spaced>
                  <span class="font-semibold">{{ item.customer.name }}</span>
                </TairoTableCell>
                <TairoTableCell spaced>
                  {{ item.month }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  {{ item.user.first_name }} {{ item.user.last_name }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex">
                    <BaseDropdown
                      variant="context"
                      label="Dropdown"
                      placement="bottom-end"
                      rounded="md"
                    >
                      <!-- <BaseDropdownItem
                        :to="`/reports/${item.id}`"
                        title="View"
                        text="Report details"
                        rounded="md"
                      /> -->
                      <BaseDropdownItem
                        :to="`/reports/${item.id}/`"
                        title="View"
                        text="View reports"
                        rounded="md"
                      />
                    </BaseDropdown>
                  </div>
                </TairoTableCell>
              </TairoTableRow>
            </TairoTable>
          </div>
          <div class="mt-6">
            <BasePagination
              :total-items="pagination.count"
              :item-per-page="pagination.perPage"
              :current-page="pagination.currentPage"
              rounded="lg"
              @update:current-page="onPageChange"
            />
          </div>
        </div>
      </div>
    </TairoContentWrapper>
    <TairoModal
      :open="isModalOpen"
      size="sm"
      @close="closeModal"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 md:p-6">
          <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
            Confirm Deletion
          </h3>
          <BaseButtonClose @click="closeModal" />
        </div>
      </template>

      <div class="p-4 md:p-6">
        <div class="mx-auto w-full max-w-xs text-center">
          <div class="relative mx-auto mb-4 flex size-24">
            <img
              src="https://media.cssninja.io/shuriken/avatars/3.svg"
              class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
              alt=""
            >
          </div>

          <h3 class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white">
            New Invite
          </h3>

          <p class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5">
            Are you sure you want to delete the report with ID: <strong>{{ selectedReportId }}</strong>?
          </p>
        </div>
      </div>

      <template #footer>
        <div class="p-4 md:p-6">
          <div class="flex gap-x-2">
            <BaseButton @click="closeModal">
              Decline
            </BaseButton>

            <BaseButton
              color="primary"
              variant="solid"
              @click="deleteReportAndCloseModal"
            >
              Accept
            </BaseButton>
          </div>
        </div>
      </template>
    </TairoModal>
  </div>
</template>

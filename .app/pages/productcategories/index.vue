<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useCurrencyFormatter } from '~/composables/useCurrencyFormatter'

const { $axios } = useNuxtApp()
const { formatCurrency } = useCurrencyFormatter()

definePageMeta({
  title: 'Products Categories List',
  preview: {
    title: 'Products Categories List',
    description: 'A list of all product categories',
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
const selectedProductCategoriesId = ref(null)

const toaster = useToaster()

function closeModal() {
  isModalOpen.value = false
}

function openModal(productCategoriesId: number) {
  selectedProductCategoriesId.value = productCategoriesId
  isModalOpen.value = true
}

async function fetchProductCategoriess() {
  try {
    const response = await $axios.get('/productcategories/', {
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

async function deleteProductCategoriesAndCloseModal() {
  isModalOpen.value = false
  try {
    const response = await $axios.delete(`/productcategories/${selectedProductCategoriesId.value}`)
    if (response.status === 204 || response.status === 200) {
      toaster.clearAll()
      toaster.show({
        title: 'Success',
        message: `The product category has been deleted!`,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })
    }
    await fetchProductCategoriess()
  }
  catch (error: any) {
    if (error.response) {
      console.log(error.response)
    }
  }
}

watch([filter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  })
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

    await fetchProductCategoriess()
  }
})

const onPageChange = (newPage) => {
  page.value = newPage
  fetchProducts()
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
          placeholder="Filter product categories..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseButton
          color="primary"
          class="w-full sm:w-40"
          to="/productcategories/create"
        >
          <Icon name="lucide:plus" class="size-4" />
          <span>Add Product Categories</span>
        </BaseButton>
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
                  Name
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  Action
                </TairoTableHeading>
              </template>

              <TairoTableRow v-for="item in data" :key="item.id">
                <TairoTableCell spaced>
                  {{ item.name }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex">
                    <BaseDropdown
                      variant="context"
                      label="Dropdown"
                      placement="bottom-end"
                      rounded="md"
                    >
                      <BaseDropdownItem
                        :to="`/productcategories/${item.id}`"
                        title="View"
                        text="Product Category details"
                        rounded="md"
                      />
                      <BaseDropdownItem
                        :to="`/productcategories/${item.id}/edit`"
                        title="Edit"
                        text="Edit product category"
                        rounded="md"
                      />
                      <BaseDropdownItem
                        title="Delete"
                        text="Delete product category"
                        rounded="md"
                        @click="openModal(item.id)"
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
            Are you sure you want to delete the product category with ID: <strong>{{ selectedProductCategoriesId }}</strong>?
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
              @click="deleteProductCategoriesAndCloseModal"
            >
              Accept
            </BaseButton>
          </div>
        </div>
      </template>
    </TairoModal>
  </div>
</template>

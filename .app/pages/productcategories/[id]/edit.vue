<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { onBeforeMount } from 'vue'
import { z } from 'zod'
const { $axios } = useNuxtApp()

definePageMeta({
  title: 'Edit product',
  preview: {
    title: 'Edit product category',
    description: 'For creating a product category',
    categories: ['layouts', 'profile', 'forms'],
    src: '/img/screens/layouts-subpages-profile-edit-1.png',
    srcDark: '/img/screens/layouts-subpages-profile-edit-1-dark.png',
    order: 76,
  },
  pageTransition: {
    enterActiveClass: 'transition-all duration-500 ease-out',
    enterFromClass: 'translate-y-20 opacity-0',
    enterToClass: 'translate-y-0 opacity-100',
    leaveActiveClass: 'transition-all duration-200 ease-in',
    leaveFromClass: 'translate-y-0 opacity-100',
    leaveToClass: 'translate-y-20 opacity-0',
  },
})

const route = useRoute()
const router = useRouter()
const data = ref([])

// This is the object that will contain the validation messages
const VALIDATION_TEXT = {
  NAME_REQUIRED: 'Your name can\'t be empty',
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    avatar: z.custom<File>(v => v instanceof File).nullable(),
    productcategory: z.object({
      name: z.string().min(1, VALIDATION_TEXT.NAME_REQUIRED),
    }),
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const productCategoryId = route.params.id

onBeforeMount(async () => {
  try {
    const response = await $axios.get(`/productcategories/${productCategoryId}`)
    data.value = response.data

    resetForm({
      values: {
        avatar: null,
        productcategory: {
          name: data.value?.name || '',
        },
      },
    })
  }
  catch (error: any) {
    console.error('Erro na requisição:', error)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token')
      router.push('/login')
    }
  }
})

function confirmSubmit() {
  closeModal()
  onSubmit()
}

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  avatar: null,
  productcategory: {
    name: '',
  },
} satisfies FormInput

// This is the computed value that will be used to display the current avatar
const currentAvatar = computed(() => data.value?.picture)

const {
  handleSubmit,
  isSubmitting,
  setFieldError,
  meta,
  values,
  errors,
  resetForm,
  setFieldValue,
  setErrors,
} = useForm({
  validationSchema,
  initialValues,
})

const success = ref(false)
const fieldsWithErrors = computed(() => Object.keys(errors.value).length)

// BaseInputFileHeadless gives us a listfile input, but we need to
// extract the file from the list and set it to the form
const inputFile = ref<FileList | null>(null)
const fileError = useFieldError('avatar')
watch(inputFile, (value) => {
  const file = value?.item(0) || null
  setFieldValue('avatar', file)
})

// Ask the user for confirmation before leaving the page if the form has unsaved changes
// onBeforeRouteLeave(() => {
//   if (meta.value.dirty && !isSubmitting.value) {
//     return confirm('You have unsaved changes. Are you sure you want to leave?')
//   }
// })

const toaster = useToaster()

const isModalOpen = ref(false)

function closeModal() {
  isModalOpen.value = false
}

function openModal() {
  isModalOpen.value = true
}

// This is where you would send the form data to the server
const onSubmit = handleSubmit(
  async (values) => {
    success.value = false

    const payload = {
      name: values.name,
    }

    // here you have access to the validated form values
    console.log('profile-edit-success', values)

    try {
      const response = await $axios.patch(`/productcategories/${productCategoryId}/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        router.push('/productcategories')
      }

      toaster.clearAll()
      toaster.show({
        title: 'Success',
        message: `Your product category has been updated!`,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })
    }
    catch (error: any) {
      if (error.response && error.response.status === 400) {
        document.documentElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        })

        toaster.clearAll()
        toaster.show({
          title: 'Oops!',
          message: 'Please review the errors in the form',
          color: 'danger',
          icon: 'lucide:alert-triangle',
          closable: true,
        })
      }
      return
    }

    // we can refresh the data from the server
    // this will update the initial values and the current avatar
    await refresh()

    resetForm()

    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    success.value = true
    setTimeout(() => {
      success.value = false
    }, 2000)

    isSubmitting.value = false
  },
  (error) => {
    // this callback is optional and called only if the form has errors
    success.value = false

    // here you have access to the error
    console.log('profile-edit-error', error)

    // you can use it to scroll to the first error
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    isSubmitting.value = false
  },
)
</script>

<template>
  <form
    method="POST"
    action=""
    class="w-full pb-16"
    @submit.prevent="onSubmit"
  >
    <BaseCard>
      <div class="flex items-center justify-between p-4">
        <div>
          <BaseHeading
            tag="h2"
            size="sm"
            weight="medium"
            lead="normal"
            class="uppercase tracking-wider"
          >
            General info
          </BaseHeading>
          <BaseText size="xs" class="text-muted-400">
            Edit your account's general information
          </BaseText>
        </div>
        <div class="flex items-center gap-2">
          <BaseButton class="w-24" to="/productcategories/">
            Cancel
          </BaseButton>
          <BaseButton
            color="primary"
            class="w-24"
            :disabled="isSubmitting"
            :loading="isSubmitting"
            @click="openModal"
          >
            Save
          </BaseButton>
        </div>
      </div>
      <div class="p-4">
        <div class="mx-auto max-w-lg space-y-12 py-8">
          <BaseMessage v-if="success" @close="success = false">
            Your profile has been updated!
          </BaseMessage>
          <BaseMessage
            v-if="fieldsWithErrors"
            type="danger"
            @close="() => setErrors({})"
          >
            This form has {{ fieldsWithErrors }} errors, please check them
            before submitting
          </BaseMessage>

          <TairoFormGroup
            label="Profile picture"
            sublabel="This is how others will recognize you"
          >
            <div
              class="relative flex flex-col items-center justify-center gap-4"
            >
              <BaseFullscreenDropfile
                icon="ph:image-duotone"
                :filter-file-dropped="(file) => file.type.startsWith('image')"
                @drop="
                  (value) => {
                    inputFile = value
                  }
                "
              />
              <BaseInputFileHeadless
                v-slot="{ open, remove, preview, files }"
                v-model="inputFile"
                accept="image/*"
              >
                <div class="relative size-24">
                  <img
                    v-if="files?.length && files.item(0)"
                    :src="preview(files.item(0)!).value"
                    alt="Upload preview"
                    class="bg-muted-200 dark:bg-muted-700/60 size-24 rounded-full object-cover object-center"
                  >
                  <img
                    v-else
                    :src="currentAvatar"
                    alt="Upload preview"
                    class="bg-muted-200 dark:bg-muted-700/60 size-24 rounded-full object-cover object-center"
                  >
                  <div
                    v-if="files?.length && files.item(0)"
                    class="absolute bottom-0 end-0 z-20"
                  >
                    <BaseButtonIcon
                      size="sm"
                      rounded="full"
                      data-nui-tooltip="Remove image"
                      @click="remove(files.item(0)!)"
                    >
                      <Icon name="lucide:x" class="size-4" />
                    </BaseButtonIcon>
                  </div>
                  <div v-else class="absolute bottom-0 end-0 z-20">
                    <div class="relative" data-nui-tooltip="Upload image">
                      <BaseButtonIcon
                        size="sm"
                        rounded="full"
                        @click="open"
                      >
                        <Icon name="lucide:plus" class="size-4" />
                      </BaseButtonIcon>
                    </div>
                  </div>
                </div>
              </BaseInputFileHeadless>
              <div
                v-if="fileError"
                class="text-danger-600 inline-block font-sans text-[.8rem]"
              >
                {{ fileError }}
              </div>
            </div>
          </TairoFormGroup>

          <TairoFormGroup
            label="Profile Info"
            sublabel="Others diserve to know you more"
          >
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 sm:col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="productcategory.name"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="ph:bowl-food"
                    placeholder="Name"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
          </TairoFormGroup>
        </div>
      </div>
    </BaseCard>
    <TairoFormSave
      :disabled="isSubmitting"
      :loading="isSubmitting"
      @reset="resetForm"
    />
  </form>
  <TairoModal
    :open="isModalOpen"
    size="sm"
    @close="closeModal"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
          Confirm Changes
        </h3>
        <BaseButtonClose @click="closeModal" />
      </div>
    </template>

    <!-- Modal Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <h3 class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white">
          Confirm Your Changes
        </h3>
        <p class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5">
          Are you sure you want to update the information for product category with ID: <strong>{{ productCategoryId }}</strong>?
        </p>
      </div>
    </div>

    <template #footer>
      <!-- Modal Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="closeModal">
            Decline
          </BaseButton>
          <BaseButton
            color="primary"
            variant="solid"
            @click="confirmSubmit"
          >
            Confirm
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
</template>

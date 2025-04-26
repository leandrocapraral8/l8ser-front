<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { onBeforeMount } from 'vue'
import { z } from 'zod'
const { $axios } = useNuxtApp()

definePageMeta({
  title: 'Create new product category',
  preview: {
    title: 'Create new product category',
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
    productcategory: z.object({
      name: z.string().min(1, VALIDATION_TEXT.NAME_REQUIRED),
    }),
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

// const { data, pending, error, refresh } = await useFetch('/api/profile')

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

    try {
      const response = await $axios.get('http://localhost:8006/users/me', {
      })

      data.value = response.data
    }
    catch (error: any) {
      console.error('Erro na requisição:', error)
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('jwt_token')
        router.push('/login')
      }
    }
  }
})

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
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
onBeforeRouteLeave(() => {
  if (meta.value.dirty && !isSubmitting.value) {
    return confirm('You have unsaved changes. Are you sure you want to leave?')
  }
})

const toaster = useToaster()

// This is where you would send the form data to the server
const onSubmit = handleSubmit(
  async (values) => {
    success.value = false

    console.log(values)

    const payload = {
      name: values.productcategory.name,
    }

    // here you have access to the validated form values
    console.log('profile-edit-success', values)

    try {
      const response = await $axios.post('/productcategories/', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        router.push('/productcategories')
      }

      toaster.clearAll()
      toaster.show({
        title: 'Success',
        message: `Your product category has been created!`,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })
    }
    catch (error: any) {
      console.log(error)
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
          <BaseButton class="w-24" to="/users/">
            Cancel
          </BaseButton>
          <BaseButton
            type="submit"
            color="primary"
            class="w-24"
            :disabled="isSubmitting"
            :loading="isSubmitting"
          >
            Save
          </BaseButton>
        </div>
      </div>
      <div class="p-4">
        <div class="mx-auto max-w-lg space-y-12 py-8">
          <BaseMessage v-if="success" @close="success = false">
            The profile has been updated!
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
</template>

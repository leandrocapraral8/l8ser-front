<script setup lang="ts">
const { $axios } = useNuxtApp()
import { onBeforeMount, ref } from 'vue'

definePageMeta({
  title: 'Communication',
  preview: {
    title: 'Communication',
    description: 'For displaying a communication info',
    categories: ['layouts', 'profile'],
    src: '/img/screens/layouts-subpages-profile.png',
    srcDark: '/img/screens/layouts-subpages-profile-dark.png',
    order: 75,
  },
})

type IncidentSeverity = 'altissimo' // Pode expandir conforme necessário
type ImpactType = 'altissimo' // Pode expandir conforme necessário

interface Incident {
  id: number
  customers: string
  date_start: string
  date_end: string
  description: string
  incident_detail: string
  incident_treatment: string
  message: string
  alert_source: string
  incident_severity: IncidentSeverity
  impact_type: ImpactType
  notification_time: string
  sent_by: string
}

const data = ref<Incident | null>(null)
const router = useRouter()
const route = useRoute()

const communicationId = route.params.id

const formatDate = (date: string) => {
  const parsedDate = new Date(date)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsedDate)
}

onBeforeMount(async () => {
  try {
    const response = await $axios.get(`http://localhost:8006/communications/${communicationId}`)
    data.value = response.data
  }
  catch (error: any) {
    console.error('Erro na requisição:', error)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token')
      router.push('/login')
    }
  }
})

</script>

<template>
  <div class="mx-auto w-full max-w-5xl">
    <div v-if="!data" />
    <div v-else class="relative w-full">
      <div class="mt-6 grid grid-cols-12 gap-6">
        <div class="col-span-12 sm:col-span-8">
          <div class="flex flex-col gap-6">
            <BaseCard class="p-8">
              <!-- General info -->
              <div class="border-muted-200 dark:border-muted-700 border-b pb-8">
                <div class="mb-4 flex items-center gap-2">
                  <h4
                    class="text-muted-400 font-sans text-xs font-semibold uppercase"
                  >
                    General info
                  </h4>
                </div>
                <div class="grid gap-x-4 gap-y-8">
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                    {{ $t("Description") }}: {{ data ? data.description : "Carregando..." }}
                  </BaseParagraph>
                </div>
              </div>
              <!-- Infos do tipo do incidente -->
              <div class="border-muted-200 dark:border-muted-700 border-b py-8">
                <div class="mb-4 flex items-center gap-2">
                  <h4
                    class="text-muted-400 font-sans text-xs font-semibold uppercase"
                  >
                    Type of impact and severity
                  </h4>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                    {{ $t("Incident severity") }}: {{ data ? data.incident_severity : "Carregando..." }}
                  </BaseParagraph>
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                    {{ $t("Type of impact") }}: {{ data ? data.impact_type : "Carregando..." }}
                  </BaseParagraph>
                </div>
              </div>
              <!-- Communication -->
              <div class="border-muted-200 dark:border-muted-700 border-b py-8">
                <div class="mb-4 flex items-center gap-2">
                  <h4
                    class="text-muted-400 font-sans text-xs font-semibold uppercase"
                  >
                    Incident communication
                  </h4>
                </div>
                <div class="grid gap-x-4 gap-y-8">
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                    {{ $t("Incident details") }}: {{ data ? data.incident_detail : "Carregando..." }}
                  </BaseParagraph>
                </div>
              </div>
              <!-- Treatment of the incident -->
              <div class="py-8">
                <div class="mb-4 flex items-center gap-2">
                  <h4
                    class="text-muted-400 font-sans text-xs font-semibold uppercase"
                  >
                    Treatment of the incident
                  </h4>
                </div>
                <div class="space-y-8">
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                    {{ $t("Treatment of the incident") }}: {{ data ? data.incident_treatment : "Carregando..." }}
                  </BaseParagraph>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-4">
          <div class="flex flex-col gap-6">
            <!-- Date info -->
            <BaseCard class="p-8">
              <div class="mb-4 flex items-center gap-2">
                <h4 class="text-muted-400 font-sans text-xs font-semibold uppercase">
                  Date info
                </h4>
              </div>
              <div class="flex justify-between">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                  {{ $t("Date start") }}: {{ data ? formatDate(data.date_start) : "Carregando..." }}
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                  {{ $t("Date end") }}: {{ data ? formatDate(data.date_end) : "Carregando..." }}
                </BaseParagraph>
              </div>
            </BaseCard>
            <!-- Tools -->
            <!-- <BaseCard class="p-8">
              <div class="mb-8 flex items-center gap-2">
                <h4
                  class="text-muted-400 font-sans text-xs font-semibold uppercase"
                >
                  Tools
                </h4>
              </div>
              <div class="space-y-6">
                <div
                  v-for="item in data.personalInfo.tools"
                  :key="item.name"
                  class="flex w-full items-center gap-2"
                >
                  <div
                    class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 relative flex size-[50px] shrink-0 items-center justify-center rounded-full border bg-white"
                  >
                    <img
                      :src="item.logo"
                      :alt="item.name"
                      class="size-8 rounded-full"
                    >
                    <BaseProgressCircle
                      :size="68"
                      :thickness="1.5"
                      :value="item.level"
                      class="text-primary-500 absolute -start-2.5 -top-2.5"
                    />
                  </div>
                  <div>
                    <BaseHeading
                      tag="h3"
                      size="sm"
                      weight="medium"
                    >
                      {{ item.name }}
                    </BaseHeading>
                    <BaseParagraph size="xs" class="text-muted-400">
                      <span>{{ item.mastery }}</span>
                    </BaseParagraph>
                  </div>
                </div>
              </div>
            </BaseCard> -->
            <!-- Recent Views -->
            <!-- <BaseCard class="p-8">
              <div class="mb-8 flex items-center gap-2">
                <h4
                  class="text-muted-400 font-sans text-xs font-semibold uppercase"
                >
                  Recent Views
                </h4>
              </div>
              <div class="space-y-6">
                <div
                  v-for="item in data.personalInfo.viewed"
                  :key="item.name"
                  class="flex w-full items-center gap-2"
                >
                  <BaseAvatar
                    :src="item.src"
                    :text="item.text"
                    size="xs"
                    :badge-src="item.badge"
                    :class="getRandomColor()"
                  />
                  <div>
                    <BaseHeading
                      tag="h3"
                      size="sm"
                      weight="medium"
                    >
                      {{ item.name }}
                    </BaseHeading>
                    <BaseParagraph size="xs" class="text-muted-400">
                      <span>{{ item.role }}</span>
                    </BaseParagraph>
                  </div>
                  <div class="ms-auto">
                    <BaseButtonIcon
                      to="#"
                      size="sm"
                      rounded="full"
                      data-nui-tooltip="View Profile"
                    >
                      <Icon name="lucide:arrow-right" class="size-4" />
                    </BaseButtonIcon>
                  </div>
                </div>
              </div>
            </BaseCard> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

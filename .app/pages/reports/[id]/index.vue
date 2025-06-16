<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
const { $axios } = useNuxtApp()

definePageMeta({
  title: 'Report',
  preview: {
    title: 'Report',
    description: 'For displaying a report',
    categories: ['layouts', 'profile'],
    src: '/img/screens/layouts-subpages-profile.png',
    srcDark: '/img/screens/layouts-subpages-profile-dark.png',
    order: 75,
  },
})

const route = useRoute()
const router = useRouter()
const reportId: string = route.params.id as string
const reportData = ref(null)
const ticketsPorPrioridade = ref(null)
const ticketsPorAtendente = ref(null)
const reportDataFormatada = ref('')
const DonutPrioridade = ref(null)
const DonutAtendente = ref(null)
const HorizontalTopScanningAttemptsPerScanner = ref(null)
const HorizontalTopProtections = ref(null)

function gerarGraficoDonut(tickets, target) {
  target.value = useDonut(tickets)
}

function gerarGraficoBarraHorizontal(checkpoint_info, target) {
  target.value = useHorizontalBarChart(checkpoint_info)
}

onBeforeMount(async () => {
  try {
    const response = await $axios.get(`/reports/${reportId}`)
    reportData.value = response.data

    if (reportData.value?.month) {
      const reportDataObj = new Date(reportData.value.month)
      const mes = reportDataObj.toLocaleString('pt-BR', { month: 'long' })
      const ano = reportDataObj.getFullYear()
      reportDataFormatada.value = `${mes.charAt(0).toUpperCase() + mes.slice(1)}/${ano}`
    }

    if (reportData.value?.freshdesk_info?.tickets_prioridade) {
      ticketsPorPrioridade.value = {
        baixa: reportData.value.freshdesk_info.tickets_prioridade.baixa,
        media: reportData.value.freshdesk_info.tickets_prioridade.media,
        alta: reportData.value.freshdesk_info.tickets_prioridade.alta,
        urgente: reportData.value.freshdesk_info.tickets_prioridade.urgente,
      }
      gerarGraficoDonut(ticketsPorPrioridade, DonutPrioridade)
    }
    else {
      console.error('Dados de tickets por prioridade não encontrados.')
    }

    if (reportData.value?.freshdesk_info?.tickets_por_atendente) {
      ticketsPorAtendente.value = reportData.value.freshdesk_info.tickets_por_atendente
      gerarGraficoDonut(ticketsPorAtendente, DonutAtendente)
    }
    else {
      console.error('Dados de tickets por prioridade não encontrados.')
    }

    if (reportData.value?.checkpoint_info?.top_scanning_attempts_per_scanner) {
      gerarGraficoBarraHorizontal(reportData.value.checkpoint_info.top_scanning_attempts_per_scanner, HorizontalTopScanningAttemptsPerScanner)
    }

    if (reportData.value?.checkpoint_info?.top_protections) {
      gerarGraficoBarraHorizontal(reportData.value.checkpoint_info.top_protections, HorizontalTopProtections)
    }
    else {
      console.error('Dados de tickets por status não encontrados.')
    }
  }
  catch (error: any) {
    console.error('Erro na requisição:', error)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token')
      router.push('/login')
    }
  }
})

function useDonut(tickets) {
  const customColors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD733',
    '#8E44AD', '#1ABC9C', '#E67E22', '#D35400', '#2980B9',
    '#C0392B', '#16A085', '#F1C40F', '#9B59B6', '#2ECC71',
    '#34495E', '#F39C12', '#ECF0F1', '#BDC3C7', '#95A5A6',
    '#7D3C98', '#2471A3', '#2874A6', '#1F618D', '#784212',
  ]

  const height = 290
  const type = 'donut'

  const labels = tickets.value
    ? Object.keys(tickets.value)
    : []
  const series = tickets.value
    ? Object.values(tickets.value)
    : []

  const options = {
    title: {
      text: '',
    },
    labels,
    colors: customColors,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 280,
            toolbar: {
              show: false,
            },
          },
          legend: {
            position: 'top',
          },
        },
      },
    ],
    legend: {
      position: 'right',
      horizontalAlign: 'center',
    },
  }

  return {
    type,
    height,
    options,
    series,
  }
}

function useHorizontalBarChart(checkpoint_info) {
  const customColors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD733',
    '#8E44AD', '#1ABC9C', '#E67E22', '#D35400', '#2980B9',
    '#C0392B', '#16A085', '#F1C40F', '#9B59B6', '#2ECC71',
    '#34495E', '#F39C12', '#ECF0F1', '#BDC3C7', '#95A5A6',
    '#7D3C98', '#2471A3', '#2874A6', '#1F618D', '#784212',
  ]

  const height = 290
  const type = 'bar'

  const labels = Object.keys(checkpoint_info)
  const series = [{
    data: Object.values(checkpoint_info),
  }]

  const options = {
    title: {
      text: '',
    },
    labels,
    colors: customColors,
    chart: {
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
      },
    },
    xaxis: {
      categories: labels,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 280,
            toolbar: {
              show: false,
            },
          },
          legend: {
            position: 'top',
          },
        },
      },
    ],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
  }

  return {
    type,
    height,
    options,
    series,
  }
}

</script>

<template>
  <div class="mx-auto w-full max-w-7xl">
    <div v-if="!reportData" />
    <div v-else class="relative w-full">
      <div class="flex w-full flex-col">
        <div style="display: flex; justify-content: center; align-items: center;">
          <img
            style="max-width: 30%;"
            src="/img/sanepar2012_logo.png"
            alt="Logo Sanepar"
          >
        </div>
        <div class="mx-auto w-full max-w-md text-center">
          <BaseParagraph size="sm" class="text-muted-400 mb-3 mt-1">
            Relatório de segurança mensal da {{ reportData?.customer?.name }} <br>
            {{ reportDataFormatada }}
          </BaseParagraph>
          <BaseParagraph size="sm" class="text-muted-400 mb-3 mt-1">
            Projeto SaaS Sanepar <br>
            Rua Engenheiros Rebouças, 1376 - Rebouças <br>
            Curitiba - Paraná
          </BaseParagraph>
          <div
            class="divide-muted-200 dark:divide-muted-800 flex items-center justify-center divide-x"
          />
        </div>
      </div>

      <div class="mt-6 grid grid-cols-12 gap-6">
        <div class="col-span-12">
          <div class="flex flex-col gap-6">
            <BaseCard class="p-8">
              <!-- Freshdesk -->
              <div class="border-muted-200 dark:border-muted-700 border-b pb-8">
                <div class="mb-4 flex items-center gap-2">
                  <h4 class="text-muted-400 font-sans text-xs font-semibold uppercase">
                    Freshdesk
                  </h4>
                </div>
                Ticket para o mês de {{ reportDataFormatada }}
                <div class="grid gap-4">
                  <div class="w-full md:grid md:grid-cols-3 md:gap-4">
                    <BaseCard rounded="none" class="w-full p-6">
                      <BaseParagraph>Tickets criados: {{ reportData?.freshdesk_info?.total_tickets }}</BaseParagraph>
                    </BaseCard>
                    <BaseCard rounded="none" class="w-full p-6">
                      <BaseParagraph>Tickets resolvidos: {{ reportData?.freshdesk_info?.tickets_status?.resolvido }}</BaseParagraph>
                    </BaseCard>
                    <BaseCard rounded="none" class="w-full p-6">
                      <BaseParagraph>Tickets não resolvidos: {{ reportData?.freshdesk_info?.tickets_status?.nao_resolvido }}</BaseParagraph>
                    </BaseCard>
                  </div>
                  <div class="w-full">
                    <BaseCard rounded="none" class="w-full p-6">
                      <BaseHeading>Tickets agrupados por prioridade</BaseHeading>
                      <AddonApexcharts v-if="DonutPrioridade" v-bind="DonutPrioridade" />
                    </BaseCard>
                  </div>
                  <div class="w-full">
                    <BaseCard rounded="none" class="w-full p-6">
                      <BaseHeading>Tickets agrupados por atendente</BaseHeading>
                      <AddonApexcharts v-if="DonutAtendente" v-bind="DonutAtendente" />
                    </BaseCard>
                  </div>
                </div>
              </div>
              <!-- Checkpoint -->
              <div v-if="reportData.checkpoint_info" class="border-muted-200 dark:border-muted-700 border-b py-8">
                <div class="mb-8 flex items-center gap-2">
                  <h4 class="text-muted-400 font-sans text-xs font-semibold uppercase">
                    Checkpoint
                  </h4>
                </div>
                <div class="grid grid-cols-4 gap-4">
                  <BaseCard rounded="none" class="col-span-2 p-6">
                    <BaseParagraph>
                      Quantidade de hosts escaneados na rede: {{ reportData?.checkpoint_info?.amount_hosts_scanned }}
                    </BaseParagraph>
                  </BaseCard>

                  <BaseCard rounded="none" class="col-span-1 row-span-2 p-6">
                    <BaseParagraph>
                      Principais tentativas de scanning por scanner:
                    </BaseParagraph>
                    <AddonApexcharts v-if="HorizontalTopScanningAttemptsPerScanner" v-bind="HorizontalTopScanningAttemptsPerScanner" />
                  </BaseCard>

                  <BaseCard rounded="none" class="col-span-1 row-span-2 p-6">
                    <BaseHeading>
                      Principais proteções:
                    </BaseHeading>
                    <AddonApexcharts v-if="HorizontalTopProtections" v-bind="HorizontalTopProtections" />
                  </BaseCard>

                  <BaseCard rounded="none" class="col-span-1 p-6">
                    <BaseParagraph>
                      Principais hosts scanned:
                    </BaseParagraph>
                    <ul class="mt-4 space-y-2">
                      <li
                        v-for="(host, index) in reportData?.checkpoint_info?.hosts_scanned"
                        :key="index"
                        class="text-sm"
                      >
                        <strong>Host:</strong> {{ host?.Host }}<br>
                        <strong>Scanner:</strong> {{ host?.Scanner }}
                      </li>
                    </ul>
                  </BaseCard>

                  <BaseCard rounded="none" class="col-span-1 p-6">
                    <BaseParagraph>
                      Principais scanners:
                    </BaseParagraph>
                    <ul class="mt-4 space-y-2">
                      <li
                        v-for="(host, index) in reportData?.checkpoint_info?.scanners"
                        :key="index"
                        class="text-sm"
                      >
                        <strong>Host:</strong> {{ host?.Host }}<br>
                        <strong>Scanner:</strong> {{ host?.Scanner }}
                        <strong>Service:</strong> {{ host?.Service }}
                      </li>
                    </ul>
                  </BaseCard>
                </div>
              </div>

              <!-- Harmony -->
              <div v-if="reportData.harmony_info" class="border-muted-200 dark:border-muted-700 border-b py-8">
                <div class="mb-8 flex items-center gap-2">
                  <h4
                    class="text-muted-400 font-sans text-xs font-semibold uppercase"
                  >
                    Coisas relacionadas ao Harmony
                  </h4>
                </div>
                <!-- <div class="grid gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div
                    v-for="item in data.personalInfo.languages"
                    :key="item.name"
                    class="flex w-full items-center gap-2"
                  >
                    <div
                      class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 relative flex size-[50px] shrink-0 items-center justify-center rounded-full border bg-white"
                    >
                      <img
                        :src="item.icon"
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
                </div> -->
              </div>
              <!-- Zabbix -->
              <div v-if="reportData.zabbix_info" class="border-muted-200 dark:border-muted-700 border-b py-8">
                <div class="mb-8 flex items-center gap-2">
                  <h4
                    class="text-muted-400 font-sans text-xs font-semibold uppercase"
                  >
                    Coisas relacionadas ao Zabbix
                  </h4>
                </div>
                <!-- <div class="space-y-8">
                  <div
                    v-for="item in data.personalInfo.skills"
                    :key="item.name"
                    class="flex w-full items-center gap-2"
                  >
                    <div
                      class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 relative flex size-[50px] shrink-0 items-center justify-center rounded-full border bg-white"
                    >
                      <img
                        v-if="'logo' in item"
                        :src="item.logo"
                        :alt="item.name"
                        class="size-8 rounded-full"
                      >
                      <Icon
                        v-else
                        :name="item.icon"
                        class="text-muted-400 size-6"
                      />
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
                        <span>{{ item.experience }} years of experience</span>
                      </BaseParagraph>
                    </div>
                    <div class="ms-auto flex items-center gap-2">
                      <BaseAvatar
                        v-for="user in item.related.people"
                        :key="user.name"
                        :src="'src' in user ? user.src : undefined"
                        :text="user.text"
                        :class="getRandomColor()"
                        :data-nui-tooltip="user.name"
                        size="xs"
                      />
                    </div>
                  </div>
                </div> -->
              </div>
              <!--Load more-->
              <div class="py-6">
                <div class="mx-auto w-full max-w-[240px]">
                  <BaseButton class="w-full">
                    Load More
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <div
          v-for="step in steps"
          :key="step.key"
          class="flex items-center"
        >
          <!-- Step Circle -->
          <div
            class="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200"
            :class="getStepClasses(step.key)"
          >
            <svg
              v-if="getStepStatus(step.key) === 'completed'"
              class="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span
              v-else
              class="text-sm font-medium"
              :class="getStepTextClasses(step.key)"
            >
              {{ step.number }}
            </span>
          </div>

          <!-- Step Label -->
          <span
            class="ml-2 text-sm font-medium hidden sm:inline"
            :class="getStepTextClasses(step.key)"
          >
            {{ step.label }}
          </span>

          <!-- Connector Line -->
          <div
            v-if="step.key !== 'review'"
            class="w-8 h-0.5 bg-gray-300 mx-2 hidden sm:block"
            :class="{
              'bg-black': getStepStatus(step.key) === 'completed'
            }"
          />
        </div>
      </div>
    </div>

    <!-- Progress Bar (Mobile) -->
    <div class="flex-1 mx-4 sm:hidden">
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-black h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  key: string;
  number: number;
  label: string;
}

interface Props {
  currentStep: string;
}

const props = defineProps<Props>();

const steps: Step[] = [
  { key: 'customer', number: 1, label: 'İletişim' },
  { key: 'shipping', number: 2, label: 'Teslimat' },
  { key: 'payment', number: 3, label: 'Ödeme' },
  { key: 'review', number: 4, label: 'Özet' },
];

const progress = computed(() => {
  const currentIndex = steps.findIndex(step => step.key === props.currentStep);
  return ((currentIndex + 1) / steps.length) * 100;
});

const getStepStatus = (stepKey: string): 'completed' | 'current' | 'upcoming' => {
  const stepIndex = steps.findIndex(step => step.key === stepKey);
  const currentIndex = steps.findIndex(step => step.key === props.currentStep);

  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'upcoming';
};

const getStepClasses = (stepKey: string) => {
  const status = getStepStatus(stepKey);
  
  switch (status) {
    case 'completed':
      return 'bg-black border-black';
    case 'current':
      return 'bg-white border-black text-black';
    case 'upcoming':
    default:
      return 'bg-white border-gray-300 text-gray-400';
  }
};

const getStepTextClasses = (stepKey: string) => {
  const status = getStepStatus(stepKey);
  
  switch (status) {
    case 'completed':
      return 'text-white';
    case 'current':
      return 'text-black';
    case 'upcoming':
    default:
      return 'text-gray-400';
  }
};
</script>

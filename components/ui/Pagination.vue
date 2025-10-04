<template>
    <div class="flex items-center justify-center space-x-1">
        <!-- Previous Button -->
        <!-- <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1" :class="[
            'flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-colors duration-200',
            currentPage <= 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        ]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button> -->

        <!-- Page Numbers -->
        <template v-for="page in visiblePages" :key="page">
            <!-- Current Page -->
            <button v-if="page === currentPage" :class="[
                'relative flex items-center justify-center w-8 h-8 text-lg font-bold rounded-md',
                ' text-black'
            ]">
                {{ page }}
                <!-- Reverse Triangle Indicator -->
                <div :class="[
                    'absolute left-1/2 transform -translate-x-1/2',
                    page >= 10 ? '-top-[1.1rem]' : '-top-[0.90rem]'
                ]">
                    <svg :class="[
                        'rotate-180',
                        page >= 10 ? 'h-18 w-18' : 'h-16 w-16'
                    ]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <polygon points="50,20 75,70 25,70" style="fill:none;stroke:currentColor;stroke-width:1" />
                    </svg>
                </div>
            </button>

            <!-- Other Pages -->
            <button v-else-if="typeof page === 'number'" @click="goToPage(page)" :class="[
                'flex items-center justify-center w-8 h-8 text-lg font-bold rounded-md transition-colors duration-200',
                'text-black  '
            ]">
                {{ page }}
            </button>

            <!-- Ellipsis -->
            <span v-else class="flex items-center justify-center w-8 h-8 text-sm text-gray-400">
                ...
            </span>
        </template>


        <!-- Next Button -->
        <!-- <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages" :class="[
            'flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-colors duration-200',
            currentPage >= totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        ]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button> -->
    </div>
</template>

<script setup lang="ts">
interface Props {
    currentPage: number;
    totalPages: number;
    maxVisiblePages?: number;
}

interface Emits {
    (e: 'page-change', page: number): void;
}

const props = withDefaults(defineProps<Props>(), {
    maxVisiblePages: 99999
});

const emit = defineEmits<Emits>();

const goToPage = (page: number) => {
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
        emit('page-change', page);
    }
};

const visiblePages = computed(() => {
    const pages: (number | string)[] = [];
    const { currentPage, totalPages, maxVisiblePages } = props;

    if (totalPages <= maxVisiblePages) {
        // If total pages is less than max visible, show all pages
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Complex pagination logic
        const halfVisible = Math.floor(maxVisiblePages / 2);

        if (currentPage <= halfVisible + 1) {
            // Show pages from start
            for (let i = 1; i <= maxVisiblePages - 2; i++) {
                pages.push(i);
            }
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - halfVisible) {
            // Show pages from end
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - (maxVisiblePages - 3); i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show pages around current
            pages.push(1);
            pages.push('...');

            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
            }

            pages.push('...');
            pages.push(totalPages);
        }
    }

    return pages;
});
</script>
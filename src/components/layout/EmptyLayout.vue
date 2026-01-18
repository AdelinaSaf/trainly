<template>
    <div class="empty-layout">
        <ThemeToggle class="theme-toggle" />
        <router-view></router-view>
    </div>
</template>

<script>
import ThemeToggle from '@/components/layout/ThemeToggle.vue';

export default {
    name: 'EmptyLayout',
    components: {
        ThemeToggle
    }
}
</script>

<style scoped>
.empty-layout {
    position: relative;
    min-height: 100vh;
    transition: background-color 0.5s ease;
}

.theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
}
</style>
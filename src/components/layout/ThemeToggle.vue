<template>
    <div
        class="theme-switcher"
        @click="toggleTheme"
        :class="{'light-theme': !darkTheme}"
        :title="darkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'"
    >
        <div class="toggle-handle">
            <i class="fas fa-moon" v-if="darkTheme"></i>
            <i class="fas fa-sun" v-else></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ThemeToggle',
    data() {
        return {
            darkTheme: true,
        }
    },
    mounted() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.applyLightTheme();
        } else if (savedTheme === 'dark') {
            this.applyDarkTheme();
        }
    },
    methods: {
        toggleTheme() {
            this.darkTheme = !this.darkTheme;
            if (this.darkTheme) {
                this.applyDarkTheme();
                localStorage.setItem('theme', 'dark');
            } else {
                this.applyLightTheme();
                localStorage.setItem('theme', 'light');
            }
        },
        applyDarkTheme() {
            this.darkTheme = true;
            document.documentElement.style.setProperty('--bg-dark', '#121212');
            document.documentElement.style.setProperty('--bg-card', '#1e1e1e');
            document.documentElement.style.setProperty('--bg-hover', '#2d2d2d');
            document.documentElement.style.setProperty('--text-primary', '#ffffff');
            document.documentElement.style.setProperty('--text-secondary', '#b0b0b0');
            document.documentElement.style.setProperty('--border', '#333333');
        },
        applyLightTheme() {
            this.darkTheme = false;
            document.documentElement.style.setProperty('--bg-dark', '#f5f7fa');
            document.documentElement.style.setProperty('--bg-card', '#ffffff');
            document.documentElement.style.setProperty('--bg-hover', '#eaeaea');
            document.documentElement.style.setProperty('--text-primary', '#2d3142');
            document.documentElement.style.setProperty('--text-secondary', '#5a5a72');
            document.documentElement.style.setProperty('--border', '#d0d0d7');
        }
    }
}
</script>

<style scoped>
.theme-switcher {
    width: 60px;
    height: 30px;
    background-color: var(--bg-card);
    border-radius: 15px;
    position: relative;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid var(--border);
}

.theme-switcher:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.toggle-handle {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 26px;
    height: 26px;
    background-color: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.light-theme .toggle-handle {
    left: calc(100% - 28px);
    background-color: var(--warning);
}

.theme-switcher i {
    font-size: 14px;
    transition: transform 0.3s ease;
}

.theme-switcher:hover i {
    transform: rotate(20deg);
}
</style>
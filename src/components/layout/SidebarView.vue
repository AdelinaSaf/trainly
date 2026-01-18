<template>
    <div class="sidebar">
        <div class="logo">
            <div class="logo-icon">
                <i class="fas fa-heartbeat"></i>
            </div>
            <div class="logo-text">Trainly</div>
        </div>

        <div class="nav-menu">
            <router-link to="/" class="nav-item" exact-active-class="active">
                <i class="fas fa-home"></i>
                <span class="nav-text">Главная</span>
            </router-link>
            <router-link v-if="!isTrainer" to="/my-workouts" class="nav-item" active-class="active">
                <i class="fas fa-dumbbell"></i>
                <span class="nav-text">Мои тренировки</span>
            </router-link>
            <router-link v-if="!isTrainer" to="/my-workout-plans" class="nav-item" active-class="active">
                <i class="fas fa-clipboard-list"></i>
                <span class="nav-text">Мои планы тренировок</span>
            </router-link>
            <router-link :to="profileLink" class="nav-item" active-class="active">
                <i class="fas fa-user"></i>
                <span class="nav-text">Профиль</span>
            </router-link>
            <div class="nav-item create-container"
                 :class="{ 'active': showCreateMenu }"
                 @click="toggleCreateMenu"
                 ref="createContainer"
            >
                <i class="dropdown-icon fas" :class="showCreateMenu ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                <span class="nav-text">Создать</span>

                <transition name="fade">
                    <div v-if="showCreateMenu" class="create-dropdown">
                        <div class="dropdown-item" @click="navigateTo('/exercises/new')">
                            <i class="fas fa-running"></i>
                            <span>Упражнение</span>
                        </div>
                        <div class="dropdown-item" @click="navigateTo('/workout-plans/new')">
                            <i class="fas fa-dumbbell"></i>
                            <span>Тренировку</span>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'SidebarView',
    data() {
        return {
            showCreateMenu: false
        }
    },
    computed:{
        userId() {
            const user = JSON.parse(localStorage.getItem('user'));
            return user.id;
        },
        profileLink() {
            return `/profile/${this.userId}`;
        },
        isTrainer() {
            const user = JSON.parse(localStorage.getItem('user'));
            return user?.role === 'trainer';
        },
    },
    async mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        toggleCreateMenu() {
            this.showCreateMenu = !this.showCreateMenu;
        },
        navigateTo(path) {
            this.$router.push(path);
            this.showCreateMenu = false;
        },
        handleClickOutside(e) {
            if (!this.$refs.createContainer.contains(e.target)) {
                this.showCreateMenu = false;
            }
        },
    }


}
</script>

<style scoped>
.sidebar {
    width: 260px;
    background-color: var(--bg-card);
    padding: 30px 20px;
    border-right: 1px solid var(--border);
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 100;
    height: 100%;
    overflow-y: auto;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 40px;
    padding-left: 10px;
}

.logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--primary), #6e45e2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-text {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(to right, var(--primary), #ad5389);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 12px;
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition);
    position: relative; /* Для позиционирования выпадающего меню */
}

.nav-item:hover, .nav-item.active {
    background-color: var(--bg-hover);
    color: var(--text-primary);
}

.nav-item i {
    font-size: 20px;
    width: 24px;
    text-align: center;
}

.create-container {
    cursor: pointer;
    position: relative;
}

.dropdown-icon {
    font-size: 12px;
    transition: transform 0.3s ease;
}

.create-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--bg-card);
    border-radius: 0 0 12px 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 110;
    margin-top: 8px;
    border: 1px solid var(--border);
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.dropdown-item:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
}

.dropdown-item i {
    width: 20px;
    text-align: center;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}


</style>

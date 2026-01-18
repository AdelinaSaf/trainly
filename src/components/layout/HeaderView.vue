<template>
    <div class="header">
        <div class="header-title">{{ currentTitle }}</div>
        <div class="user-actions">
            <ThemeToggle></ThemeToggle>
            <div class="user-profile" @click="router().push(`/profile`)">
                <div class="user-avatar">{{ userAvatar }}</div>
                <div class="user-info">
                    <div class="user-name">{{ userName }}</div>
                    <div class="user-role">{{ userRole === 'trainer' ? 'Тренер' : 'Пользователь' }}</div>
                </div>

            </div>
            <button class="logout-btn" @click="logout">
                <i class="fas fa-sign-out-alt"></i> Выйти
            </button>
        </div>
    </div>
</template>

<script>
import ThemeToggle from "@/components/layout/ThemeToggle.vue";
import router from "@/router";

export default {
    name: 'HeaderView',
    components: {ThemeToggle},
    data() {
        return {
            darkTheme: true,
            titles: {
                '/': 'Главная',
                '/workouts': 'Тренировки',
                '/progress': 'Прогресс',
                '/profile': 'Профиль'
            }
        }
    },
    computed: {
        currentTitle() {
            return this.titles[this.$route.path] || 'Healer AI'
        },
        userName() {
            const user = JSON.parse(localStorage.getItem('user'));
            return user ? user.username : 'Гость';
        },
        userAvatar() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.username) return 'Г';

            const parts = user.username.trim().split(/\s+/);

            let avatar = parts[0].charAt(0).toUpperCase();

            if (parts.length > 1) {
                avatar += parts[parts.length - 1].charAt(0).toUpperCase();
            }

            return avatar;
        },
        userRole() {
            const user = JSON.parse(localStorage.getItem('user'));
            return user ? user.role : '';
        }
    },
    methods: {
        router() {
            return router
        },
        async logout() {
            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    await fetch('http://localhost:8042/logout', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }
            } catch (error) {
                console.error('Ошибка при выходе:', error);
            }

            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    height: 80px;
}

.header-title {
    font-size: 28px;
    font-weight: 700;
}

.user-actions {
    display: flex;
    gap: 20px;
    align-items: center;
}

.search-box {
    position: relative;
}

.search-box input {
    background-color: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 30px;
    padding: 10px 20px 10px 40px;
    color: var(--text-primary);
    width: 280px;
    font-size: 14px;
    transition: var(--transition);
}

.search-box input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(77, 150, 255, 0.2);
}

.search-box i {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 30px;
    transition: var(--transition);
}

.user-profile:hover {
    background-color: var(--bg-hover);
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), #ad5389);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.logout-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    border-radius: 30px;
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: var(--transition);
}

.logout-btn:hover {
    background-color: var(--bg-hover);
    color: var(--accent);
    border-color: var(--accent);
}

@media (max-width: 768px) {
    .user-info {
        display: none;
    }
}
</style>
<template>
    <div class="not-found-page">
        <div class="error-container">
            <div class="error-content">
                <h1 class="error-title">Страница не найдена</h1>
                <p class="error-message">
                    Извините, запрашиваемая страница не существует или была перемещена.
                </p>
                <div class="action-buttons">
                    <router-link to="/" class="home-button">
                        <i class="fas fa-home"></i> На главную
                    </router-link>
                    <button @click="goBack" class="back-button">
                        <i class="fas fa-arrow-left"></i> Назад
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotFoundPage',

    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>

<style scoped>
.not-found-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f8f9fa;
    padding: 20px;
}

.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    text-align: center;
}

.error-image {
    max-width: 100%;
    height: auto;
    max-height: 400px;
    margin-bottom: 30px;
}

.error-content {
    padding: 0 20px;
}

.error-title {
    font-size: 2.5rem;
    color: #343a40;
    margin-bottom: 15px;
}

.error-message {
    font-size: 1.2rem;
    color: #6c757d;
    margin-bottom: 30px;
    line-height: 1.6;
}

.action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

.home-button, .back-button {
    padding: 12px 25px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.home-button {
    background-color: #3a86ff;
    color: white;
    border: none;
}

.back-button {
    background-color: white;
    color: #3a86ff;
    border: 2px solid #3a86ff;
}

.home-button:hover {
    background-color: #2667cc;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(58, 134, 255, 0.3);
}

.back-button:hover {
    background-color: #f0f7ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .error-title {
        font-size: 2rem;
    }

    .error-message {
        font-size: 1rem;
    }

    .home-button, .back-button {
        padding: 10px 20px;
        font-size: 0.9rem;
    }
}
</style>
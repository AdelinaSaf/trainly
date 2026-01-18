<template>
    <section class="about-section">
        <div class="content-wrapper" v-if="aboutData">
            <div class="image-container">
                <img :src="aboutData.image" alt="Trainly App">
            </div>
            <div class="text-content">
                <h1 class="main-heading">{{ aboutData.title }}</h1>
                <p class="description">{{ aboutData.content }}</p>
            </div>

        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            aboutData: null,
            error: null
        }
    },
    async mounted() {
        try {
            const response = await fetch('http://localhost:8042/api/about');
            if (!response.ok) throw new Error('Ошибка загрузки');
            this.aboutData = await response.json();
        } catch (e) {
            this.error = e.message;
        }
    }
}
</script>

<style scoped>
.about-section {
    min-height: 70vh;
    display: flex;
    align-items: center;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    align-items: center;
}

.main-heading {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
}

.description {
    font-size: 1.1rem;
    color: #7f8c8d;
    max-width: 800px;
    margin: 0 auto 3rem;
    line-height: 1.6;
}


.stat-item p {
    color: #7f8c8d;
    font-size: 0.9rem;
}
.image-container {
    flex: 1;
    max-width: 500px;
}

.image-container img {
    width: 100%;
    height: auto;
    border-radius: 12px;
}

.text-content {
    flex: 1;
    text-align: left;
    justify-content: center;
}


.main-heading {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    line-height: 1.2;
}

.description {
    font-size: 1.1rem;
    color: black;
    line-height: 1.6;
    margin-bottom: 2rem;
}


@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .main-heading {
        font-size: 2rem;
    }
}
</style>
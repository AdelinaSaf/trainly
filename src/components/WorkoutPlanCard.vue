<template>
    <div class="plan-card">
        <div class="card-header">
            <div class="plan-icon">
                <i class="fas fa-calendar-check"></i>
            </div>
            <div class="plan-info">
                <div class="plan-title">{{ title }}</div>
                <div class="plan-meta">
                    <span class="badge">{{ goal }}</span>
                    <span class="badge">{{ difficulty }}</span>
                    <span v-if="isActive" class="badge active-badge">Активный</span>
                </div>
            </div>
        </div>

        <div class="plan-details">
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                Длительность: {{ durationWeeks }} недель
            </div>
            <div class="detail-item">
                <i class="fas fa-dumbbell"></i>
                Тренировок: {{ workoutsCount }}
            </div>
            <div class="detail-item" v-if="createdAt">
                <i class="fas fa-calendar-day"></i>
                Создан: {{ formatDate(createdAt) }}
            </div>
        </div>

        <div class="plan-description" v-if="description">
            {{ description }}
        </div>

    </div>
</template>

<script>
export default {
    name: 'WorkoutPlanCard',
    props: {
        title: String,
        goal: String,
        difficulty: String,
        durationWeeks: Number,
        workoutsCount: Number,
        isActive: Boolean,
        createdAt: String,
        description: String
    },
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
        viewPlan() {
            this.$emit('view');
        }
    }
}
</script>

<style scoped>
.plan-card {
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid var(--border);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.plan-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.active-plan {
    border-left: 4px solid var(--primary);
}

.card-header {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    align-items: flex-start;
}

.plan-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), #6e45e2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.plan-icon i {
    font-size: 20px;
    color: white;
}

.plan-info {
    flex: 1;
}

.plan-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.plan-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.badge {
    background-color: var(--bg-hover);
    color: var(--text-primary);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.active-badge {
    background-color: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
}

.plan-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
    padding: 10px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text-secondary);
}

.plan-description {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 20px;
    line-height: 1.5;
    flex: 1;
}

.plan-actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
}
</style>
<template>
    <div class="workout-card">
        <div class="card-header">
            <div class="workout-icon">
                <i class="fas fa-dumbbell"></i>
            </div>
            <div class="workout-title">{{ title }}</div>
        </div>

        <div class="workout-meta">
            <div class="meta-item">
                <i class="fas fa-calendar-day"></i>
                {{ dayOfWeek }}
            </div>
            <div class="meta-item">
                <i class="fas fa-list-check"></i>
                {{ exercisesCount }} упражнений
            </div>
        </div>

        <div class="workout-actions">
            <button
                @click.stop="$emit('start')"
                class="btn btn-sm btn-primary"
            >
                <i class="fas fa-play"></i> Начать
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WorkoutCard',
    props: {
        title: {
            type: String,
            required: true
        },
        dayOfWeek: {
            type: String,
            required: true
        },
        exercisesCount: {
            type: Number,
            required: true
        }
    }
}
</script>

<style scoped>
.workout-card {
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.workout-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    border-color: var(--primary);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}

.workout-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), #6e45e2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.workout-icon i {
    font-size: 20px;
    color: white;
}

.workout-title {
    font-size: 18px;
    font-weight: 600;
    flex: 1;
}

.workout-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
    padding-left: 10px;
    border-left: 2px solid var(--primary);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
    font-size: 14px;
}

.workout-actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
}

.btn-sm {
    padding: 8px 15px;
    font-size: 14px;
}
</style>
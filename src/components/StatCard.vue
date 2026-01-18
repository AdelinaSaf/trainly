<template>
    <div class="stat-card">
        <div class="stat-header">
            <div class="stat-title">{{ title }}</div>
            <div class="stat-icon" :class="iconClass">
                <i :class="icon"></i>
            </div>
        </div>
        <div class="stat-value">{{ value }}</div>
        <div class="stat-change" :class="changeClass">
            <i :class="changeIcon"></i>
            <span>{{ changeText }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StatCard',
    props: {
        title: String,
        value: String,
        changeText: String,
        icon: String,
        iconClass: String,
        isNegative: Boolean
    },
    computed: {
        changeClass() {
            return this.isNegative ? 'negative' : ''
        },
        changeIcon() {
            return this.isNegative ? 'fas fa-arrow-down' : 'fas fa-arrow-up'
        }
    }
}
</script>

<style scoped>
.stat-card {
    background-color: var(--bg-card);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: var(--transition);
    border: 1px solid transparent;
}

.stat-card:hover {
    border-color: var(--primary);
    transform: translateY(-5px);
}

.stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.stat-icon.heart { background-color: rgba(255, 107, 107, 0.15); color: var(--accent); }
.stat-icon.calories { background-color: rgba(77, 150, 255, 0.15); color: var(--primary); }
.stat-icon.steps { background-color: rgba(76, 175, 80, 0.15); color: var(--success); }
.stat-icon.sleep { background-color: rgba(158, 119, 237, 0.15); color: #9e77ed; }

.stat-title {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 8px;
}

.stat-value {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;
}

.stat-change {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--success);
}

.stat-change.negative {
    color: var(--accent);
}
</style>
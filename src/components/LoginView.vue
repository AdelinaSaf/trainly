<template>
    <div class="login-container">
        <div class="login-card">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <h1 class="app-title">Добро пожаловать в Trainly</h1>
                <p class="app-subtitle">Войдите в свой аккаунт</p>
            </div>

            <form @submit.prevent="submitForm" class="login-form">
                <div class="form-group">
                    <label for="email">Email*</label>
                    <input
                        type="email"
                        id="email"
                        v-model="formData.email"
                        required
                        placeholder="example@mail.com"
                        :class="{ 'error-border': errors.email }"
                    >
                    <div v-if="errors.email" class="error">{{ errors.email }}</div>
                </div>

                <div class="form-group">
                    <label for="password">Пароль*</label>
                    <input
                        type="password"
                        id="password"
                        v-model="formData.password"
                        required
                        placeholder="Введите ваш пароль"
                        :class="{ 'error-border': errors.password }"
                    >
                    <div v-if="errors.password" class="error">{{ errors.password }}</div>
                </div>

                <button
                    type="submit"
                    class="submit-btn"
                    :disabled="loading"
                >
                    {{ loading ? 'Вход...' : 'Войти' }}
                </button>

                <div v-if="error" class="error-message">
                    <i class="fas fa-exclamation-circle"></i> {{ error }}
                </div>
            </form>

            <div class="login-link">
                Ещё нет аккаунта? <router-link to="/registration">Зарегистрируйтесь</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginView',
    data() {
        return {
            formData: {
                email: '',
                password: ''
            },
            errors: {
                email: '',
                password: ''
            },
            loading: false,
            error: null
        }
    },
    methods: {
        validateForm() {
            this.errors = { email: '', password: '' };
            let isValid = true;

            if (!this.formData.email) {
                this.errors.email = 'Email обязателен';
                isValid = false;
            } else if (!this.validateEmail(this.formData.email)) {
                this.errors.email = 'Введите корректный email';
                isValid = false;
            }

            if (!this.formData.password) {
                this.errors.password = 'Пароль обязателен';
                isValid = false;
            }

            return isValid;
        },

        validateEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        async submitForm() {
            if (!this.validateForm()) return;

            this.loading = true;
            this.error = null;

            try {
                const response = await fetch('http://localhost:8042/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(this.formData)
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Ошибка входа');
                }

                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));


                this.$router.push('/');

            } catch (error) {
                this.error = error.message || 'Неверный email или пароль';
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--bg-dark);
    padding: 20px;
}

.login-card {
    background-color: var(--bg-card);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 500px;
    overflow: hidden;
}

.logo-section {
    background: linear-gradient(135deg, var(--primary), #6e45e2);
    padding: 40px 30px;
    text-align: center;
    color: white;
}

.logo-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
}

.app-title {
    font-size: 28px;
    margin-bottom: 10px;
    font-weight: 700;
}

.app-subtitle {
    font-size: 16px;
    opacity: 0.9;
}

.login-form {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    position: relative;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #b0b0b0;
}

input[type="email"],
input[type="password"] {
    width: 100%;
    padding: 14px;
    background-color: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 16px;
    transition: all 0.3s ease;
}

input:focus {
    outline: none;
    border-color: #4d96ff;
    box-shadow: 0 0 0 3px rgba(77, 150, 255, 0.2);
}

.remember-forgot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-secondary);
}

.forgot-password {
    color: #4d96ff;
    text-decoration: none;
    font-size: 14px;
}

.forgot-password:hover {
    text-decoration: underline;
}

.submit-btn {
    background: linear-gradient(135deg, #4d96ff, #6e45e2);
    color: white;
    border: none;
    border-radius: 30px;
    padding: 16px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(77, 150, 255, 0.3);
}

.submit-btn:disabled {
    background: #555;
    cursor: not-allowed;
    opacity: 0.7;
}

.login-link {
    text-align: center;
    padding: 20px 0;
    color: var(--text-secondary);
    border-top: 1px solid var(--border);
}

.login-link a {
    color: #4d96ff;
    text-decoration: none;
    font-weight: 600;
}

.login-link a:hover {
    text-decoration: underline;
}

.error {
    color: #ff6b6b;
    font-size: 14px;
    margin-top: 5px;
}

.error-message {
    background-color: rgba(255, 107, 107, 0.1);
    border: 1px solid #ff6b6b;
    border-radius: 8px;
    padding: 15px;
    color: #ff6b6b;
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

@media (max-width: 768px) {
    .login-card {
        border-radius: 12px;
    }

    .logo-section {
        padding: 30px 20px;
    }

    .login-form {
        padding: 20px;
    }

}
</style>
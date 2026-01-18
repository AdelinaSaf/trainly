<template>
    <div class="app-container">
        <div class="sidebar-container">
            <Sidebar/>
        </div>
        <div class="main-content">
            <div class="header-container">
                <Header/>
            </div>
            <div class="content-wrapper">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '@/components/layout/SidebarView.vue'
import Header from '@/components/layout/HeaderView.vue'

export default {
    components: {Sidebar, Header}
}
</script>
<style>

.app-container {
    display: flex;
    min-height: 100vh;
}

.sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 260px;
    z-index: 100;
    overflow-y: auto;
}

.main-content {
    flex: 1;
    margin-left: 260px;
    width: calc(100% - 260px);
}

.header-container {
    position: fixed;
    top: 0;
    left: 260px;
    right: 0;
    z-index: 90;
    background-color: var(--bg-dark);
}

.content-wrapper {
    margin-top: 80px;
    padding: 30px;
}


</style>
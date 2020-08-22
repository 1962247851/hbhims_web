<template>
    <v-app id="app">
        <router-view name="header"/>
        <v-main>
            <v-container fluid>
                <keep-alive>
                    <router-view/>
                </keep-alive>
            </v-container>
        </v-main>
        <router-view name="footer"/>
    </v-app>
</template>

<script>

    export default {
        name: 'App',
        data: vm => ({
            initialDark: vm.$vuetify
                ? vm.$vuetify.theme.dark
                : false
        }),
        beforeDestroy() {
            if (!this.$vuetify) return
            this.$vuetify.theme.dark = this.initialDark
        },
        created() {
            document.title = "人体基本健康信息管理系统"
        }
    }
</script>

<style>
</style>

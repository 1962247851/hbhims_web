<template>
    <div>
        <v-navigation-drawer app v-model="drawer" mini-variant-width="70" color="primary" dark
                             :expand-on-hover="$vuetify.breakpoint.lgAndUp" width="300">
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">
                        人体基本健康信息管理系统
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider/>
            <v-list nav shaped>
                <div v-for="item in items" :key="item.title">
                    <v-list-group v-if="item.children" :prepend-icon="item.icon" color="white">
                        <template v-slot:activator>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </template>
                        <v-list nav dense shaped>
                            <v-list-item v-for="item in item.children" :key="item.title" link replace
                                         :to="item.path">
                                <v-list-item-icon>
                                    <v-icon>{{ item.icon }}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-list-group>
                    <v-list-item v-else link replace :to="item.path">
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer">
                <v-icon v-if="drawer">mdi-chevron-left</v-icon>
                <v-icon v-else>mdi-chevron-right</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer/>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" href="https://github.com/1962247851" target="_blank">
                        <v-icon>mdi-github</v-icon>
                    </v-btn>
                </template>
                <span>Github主页</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="$vuetify.theme.dark=!$vuetify.theme.dark">
                        <v-icon v-if="!$vuetify.theme.dark">mdi-brightness-7</v-icon>
                        <v-icon v-else>mdi-brightness-4</v-icon>
                    </v-btn>
                </template>
                <span>{{$vuetify.theme.dark?"切换为日间模式":"切换为夜间模式"}}</span>
            </v-tooltip>
            <v-menu offset-y open-on-hover nudge-bottom="5">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn text class="align-self-center mr-4" v-bind="attrs" v-on="on">
                        <v-avatar size="30">
                            <img src="../assets/logo.svg" alt="头像">
                        </v-avatar>
                        {{username}}
                        <v-icon right>mdi-menu-down</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="logout">
                        <v-list-item-icon>
                            <v-icon>mdi-logout-variant</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>退出登录</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>
    </div>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                drawer: false,
                title: "首页",
                username: "",
                items: [
                    {title: "首页", icon: "mdi-home", path: "/admin/home"},
                    {title: "运动", icon: "mdi-foot-print", path: "/admin/sport"},
                    {title: "睡眠", icon: "mdi-sleep", path: "/admin/sleep"},
                    {
                        title: "BMI", icon: "mdi-human", path: "/admin/bmi",
                        children: [
                            {title: "身高", icon: "mdi-human-male-height", path: "/admin/bmi/height"},
                            {title: "体重", icon: "mdi-weight", path: "/admin/bmi/weight"}
                        ]
                    },
                    {
                        title: "血液", icon: "mdi-hospital", path: "/admin/blood", children: [
                            {title: "血压", icon: "mdi-speedometer", path: "/admin/blood/bloodpressure"},
                            {title: "血糖", icon: "mdi-spoon-sugar", path: "/admin/blood/bloodsugar"},
                            {title: "血氧", icon: "mdi-percent", path: "/admin/blood/bloodoxygen"},
                        ]
                    },
                ]
            }
        },
        methods: {
            logout() {
                if (confirm("确定退出登录？")) {
                    this.axios.get(this.API.URL.USER_LOGOUT)
                        .then(value => {
                            let data = value.data
                            if (data.success) {
                                sessionStorage.removeItem("state")
                                alert("退出登录成功")
                                this.$router.replace({path: "/admin/login"})
                            } else {
                                alert(data.errorMsg)
                                console.log(value)
                            }
                        }, reason => {
                            console.log(reason)
                        })
                }
            }

        },
        mounted() {
            this.username = sessionStorage.getItem("username")
        },
        watch: {
            '$route': {
                handler() {
                    setTimeout(() => {
                        this.title = this.$route.meta.title
                    }, 100)
                },
                // 首次进入页面即执行
                immediate: true
            }
        }
    }
</script>

<style scoped>

</style>
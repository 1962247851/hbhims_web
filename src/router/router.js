import Vue from 'vue'
import VueRouter from 'vue-router'
import Header from "../components/Header"
import Footer from "../components/Footer"

Vue.use(VueRouter)

export const constantRouters = [
    {
        path: "",
        redirect: "/admin"
    },
    {
        path: "/admin",
        redirect: "/admin/home"
    },
    {
        path: "/admin/home",
        components: {
            header: Header,
            default: () => import("../components/admin/Home"),
            footer: Footer
        },
        meta: {
            title: "首页"
        }
    },
    {
        path: "/admin/sport",
        components: {
            header: Header,
            default: () => import("../components/admin/sport/Sport"),
            footer: Footer
        },
        meta: {
            title: "运动"
        }
    },
    {
        path: "/admin/sleep",
        components: {
            header: Header,
            default: () => import("../components/admin/sleep/Sleep"),
            footer: Footer
        },
        meta: {
            title: "睡眠"
        }
    },
    {
        path: "/admin/bmi",
        components: {
            header: Header,
            default: () => import("../components/admin/bmi/BMI"),
            footer: Footer
        },
        children: [
            {
                path: "/admin/bmi/height",
                component: () => import("../components/admin/bmi/height/Height"),
                meta: {
                    title: "身高"
                }
            },
            {
                path: "/admin/bmi/weight",
                component: () => import("../components/admin/bmi/weight/Weight"),
                meta: {
                    title: "体重"
                }
            }
        ]

    },
    {
        path: "/admin/blood",
        components: {
            header: Header,
            default: () => import("../components/admin/blood/Blood"),
            footer: Footer
        },
        children: [
            {
                path: "/admin/blood/bloodpressure",
                component: () => import("../components/admin/blood/pressure/BloodPressure"),
                meta: {
                    title: "血压"
                }
            },
            {
                path: "/admin/blood/bloodsugar",
                component: () => import("../components/admin/blood/sugar/BloodSugar"),
                meta: {
                    title: "血糖"
                }
            },
            {
                path: "/admin/blood/bloodoxygen",
                component: () => import("../components/admin/blood/oxygen/BloodOxygen"),
                meta: {
                    title: "血氧"
                }
            }
        ]
    },
    {
        path: "/admin/login",
        component: () => import("../components/admin/Login")
    },
    {
        path: "*",
        component: () => import("../components/NotFound"),
    },
    {
        path: "/404",
        name: "404",
        component: () => import("../components/NotFound"),
    }
]


export default new VueRouter({
    routes: constantRouters,
    scrollBehavior(to, from, saveTop) {
        if (saveTop) {
            return saveTop;
        } else {
            return {x: 0, y: 0}
        }
    }
})
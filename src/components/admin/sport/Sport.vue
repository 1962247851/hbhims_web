<template>
    <div>
        <v-data-table :items="sports" :loading="loading" :search="search"
                      :headers="headers" sort-by="id" class="elevation-2">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="搜索" clearable single-line
                                  hide-details class="me-2"/>
                    <v-btn color="primary" :disabled="loading" icon @click="refresh">
                        <v-progress-circular color="primary" size="18" width="2" v-if="loading" indeterminate/>
                        <v-icon v-else>mdi-refresh</v-icon>
                    </v-btn>
                    <v-btn color="primary" dark icon @click="dialog = true">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer/>
                <v-dialog v-model="dialog" max-width="500px" persistent>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.userId" label="用户Id"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-dialog ref="dialog" v-model="dialogDateModal" :return-value.sync="dialogDate"
                                                  persistent width="290px">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="dialogDate" label="日期"
                                                              readonly v-bind="attrs" v-on="on"/>
                                            </template>
                                            <v-date-picker v-model="dialogDate" scrollable locale="zh-cn">
                                                <v-spacer/>
                                                <v-btn text color="primary" @click="dialogDateModal = false">取消</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialog.save(dialogDate)">确定
                                                </v-btn>
                                            </v-date-picker>
                                        </v-dialog>

                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field type="number" v-model="editedItem.stepValue" label="步数"/>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field type="number" v-model="editedItem.distance" label="距离(km)"
                                                      disabled messages="根据步数自动计算"/>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field type="number" v-model="editedItem.calorie" label="卡路里(cal)"
                                                      disabled messages="根据步数自动计算"/>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                            <v-btn color="blue darken-1" text @click="save">保存</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template>

            <template v-slot:item.id="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <strong>{{item.id}}</strong>
            </template>

            <template v-slot:item.date="{ item }">
                <v-card-text>{{UTIL.formatTimeTwo(item.date,"Y年M月D日")}}</v-card-text>
            </template>

            <template v-slot:item.deleted="{ item }">
                <v-btn icon small @click="deleteItem(item)" color="error">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    export default {
        name: "Sport",
        data() {
            return {
                sports: [],
                loading: true,
                search: "",
                dialog: false,
                editedItem: {},
                editedIndex: -1,
                defaultItem: {},

                dialogDate: new Date().toISOString().substring(0, 10),
                dialogDateModal: false,

                headers: [
                    {text: '序号', align: 'center', value: 'id'},
                    {text: '用户Id', value: 'userId'},
                    {text: '日期', value: 'date'},
                    {text: '步数', value: 'stepValue'},
                    {text: '距离（km）', value: 'distance'},
                    {text: '卡路里（cal）', value: 'calorie'},
                    {text: '删除', value: 'deleted'},
                ],
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? '添加' : '编辑'
            },
        },
        watch: {
            dialog(val) {
                val || this.close()
            },
        },
        methods: {
            save() {
                this.editedItem.date = this.UTIL.ISODateStringToTimestamp(this.dialogDate)
                this.axios.put(this.API.URL.INSERT_OR_REPLACE_SPORT, this.editedItem).then(value => {
                    if (value.data.success) {
                        //根据userId和Date判断是否本地已存在
                        let replace = false
                        for (let i = 0; i < this.sports.length; i++) {
                            if (this.sports[i].id === value.data.data.id) {
                                this.editedIndex = i
                                replace = true
                                break
                            }
                        }
                        if (this.editedIndex > -1 || replace) {
                            Object.assign(this.sports[this.editedIndex], value.data.data)
                        } else {
                            this.sports.push(value.data.data)
                        }
                        this.close()
                    }
                })
            },
            deleteItem(item) {
                if (confirm("确定删除运动：\n" + item.id)) {
                    const index = this.sports.indexOf(item)
                    this.axios.delete(this.API.URL.DELETE_SPORT + item.id).then(result => {
                        let data = result.data
                        if (data.success) {
                            alert("删除成功")
                            this.sports.splice(index, 1)
                        }
                    })
                }
            },
            editItem(item) {
                this.editedIndex = this.sports.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
                this.dialogDate = this.UTIL.formatTimeTwo(item.date, "Y-M-D")
            },
            close() {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
            },
            refresh() {
                this.getSports()
            },
            getSports() {
                this.loading = true
                let _this = this
                this.axios.get(this.API.URL.QUERY_ALL_SPORT)
                    .then(function (result) {
                        _this.loading = false
                        let data = result.data
                        if (data.success) {
                            _this.sports = data.data
                        }
                    }, function (error) {
                        _this.loading = false
                        console.log(error)
                    })
            }
        },
        created() {
            this.getSports(1)
        }
    }
</script>

<style scoped>

</style>
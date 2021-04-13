//index.js
//获取应用实例
const app = getApp()

const g = app.globalData;

const yy = app.yy;

Page({
    data: {
        questionData: [{
                title: '你的年级是',
                question: [
                    '大一',
                    '大二',
                    '大三',
                    '大四'
                ]
            },
            {
                title: '你的学院是',
                question: [
                    '计算机学院',
                ]
            },
        ],
        select: [
            '完全符合',
            '大致符合',
            '部分符合',
            '小部分符合',
            '完全不符合',
        ],
        lastQuestion: {
            title: '是否喜欢计算机',
            question: [
                // '很喜欢',
                // '一般喜欢',
                // '不知道',
                // '不喜欢',
                // '很不喜欢',
                '喜欢',
                '不喜欢'
            ]
        }
    },
    onLoad() {

        if (g.userData.status === 1) {
            wx.showModal({
                title: '提示',
                content: '系统检测到你已经录入过一次。不可重复录入',
                showCancel: false,
                confirmText: '返回',
                confirmColor: '#0cf',
                success: res => {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
        }
        this.getQuestionList()

        wx.showModal({
            title: '答题说明',
            content: '本问卷调查是广东工业大学计算机学院的一个大学生实践创新项目。这个项目希望通过回答一些问题来测试一个人是否喜欢学习计算机。现在是数据收集阶段，因此请各位同学能尽量准确回答其中的问题。回答完毕大概需要3~5分钟。谢谢你花费时间支持我们的工作。谢谢啦！',
            confirmText: '知悉',
            cancelText: '返回',
            confirmColor: '#0cf',
            success: res => {
                if (res.confirm) {

                } else if (res.cancel) {
                    wx.navigateBack({

                    })
                }
            }
        })

    },
    getQuestionList() {
        let url = g.ip + g.request.getQuestion;
        yy.request({
                url
            })
            .then(res => {
                //新数据
                let data = res.data.data

                //获取选项（5选项）
                let select = this.data.select

                //获取旧数据
                let oldData = this.data.questionData

                //获取最后一个问题
                let lastQuestion = this.data.lastQuestion;


                //处理数据
                for (var i = 0; i < data.length; i++) {
                    let temp = {};
                    temp.title = data[i].question;
                    temp.question = select;
                    oldData.push(temp)
                }

                oldData.push(lastQuestion)
                this.setData({
                    questionData: oldData
                })
            })
    },
    submit(e) {
        let answer = e.detail
        yy.showModal({
                title: '确认',
                content: '确定提交吗？',
                confirmText: '提交',
                confirmColor: '#0cf'
            })

            .then(res => {
                if (res.confirm) {

                    let url = g.ip + g.request.submitTestQuestionnaire

                    let data = this.handleData(answer)

                    return yy.request({
                        url,
                        data,
                        method: 'post'
                    })
                }
            })

            .then(res => {
                if (res.data.code === 200) {
                    g.userData.status = 1;
                    return yy.showModal({
                        title: '录入成功',
                        content: '感谢您的参与！',
                        showCancel: false,
                        confirmText: '返回主页',
                        confirmColor: '#0cf',
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        mask: true,
                    })
                    throw 'err'
                }

            })

            .then(res => {

                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/user/user',
                    })

                }

            })
    },


    handleData(data) {
        console.log(data, 'data')

        let res = {
            uid: g.userData.id,
            //年龄：如果未填（-1）则为-1 否则+1
            grade: Number(data[0]) === -1 ? -1 : Number(data[0]) + 1,
            college: "计算机学院",
            //是否喜欢计算机：如果未填（-1）则为-1 否则+1
            isLike: Number(data[data.length - 1]) === -1 ? -1 : Number(data[data.length - 1]) + 1
        }

        for (let i = 2; i < data.length - 1; i++) {
            let index = `question${i-1}`;
            res[index] = Number(data[i]) === -1 ? -1 : Number(data[i]) + 1;
        }

        return res;
    },

})
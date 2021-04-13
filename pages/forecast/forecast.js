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
    },


    onLoad() {
        this.getQuestionList()
        wx.showModal({
            title: '答题说明',
            content: '表内每一叙述之后均有五个选项，依照层次高低排列。请按照你实际行为表现与题目相符的程度，勾选适当的选项：完全不符选择1，小部分符合选择2，部分符合选择3，大致符合选择4，完全符合选择5。',
            showCancel: false,
            confirmText: '知悉',
            confirmColor: '#0cf'
        })

    },

    submit(e) {
        let answer = e.detail;
        let resForecast = {};
        //确认是否提交
        yy.showModal({
                title: '确认',
                content: '确定提交吗？',
                confirmText: '提交',
                confirmColor: '#0cf',
            })

            .then(res => {
                //提交
                if (res.confirm) {
                    let data = this.handleData(answer)
                    return yy.showLoading({
                        title: '急速预测中...',
                        mask: true
                    })
                } else { //暂不提交
                    throw 'err'
                }
            })

            //提交——》发送问卷填写结果
            .then(res => {

                let url = g.ip + g.request.submitForecastQuestionnaire

                let data = this.handleData(answer)

                return yy.request({
                    url,
                    data,
                    method: 'post'
                })
            })

            //获取预测结果
            .then(res => {
                wx.hideLoading({})
                console.log(res,'预测结果')
                if (res.data.code === 200) {
                    resForecast = res.data.data; 
                    return yy.showModal({
                        title: '预测成功',
                        content: '感谢您的参与！',
                        showCancel: false,
                        confirmText: '预测结果',
                        confirmColor: '#0cf',
                    })

                }else{
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        mask: true,
                    })
                    throw 'err'
                }

            })

            //跳转页面
            .then(res => {

                if (res.confirm) {
                    let data = JSON.stringify(resForecast)
                    wx.reLaunch({
                        url: '/pages/res/res?data=' + data
                    })
                }else{
                    throw 'err'
                }
            })
            .catch(err=>{
                console.log(err)
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


                //处理数据
                for (var i = 0; i < data.length; i++) {
                    let temp = {};
                    temp.title = data[i].question;
                    temp.question = select;
                    oldData.push(temp)
                }

                this.setData({
                    questionData: oldData
                })
            })
    },


    handleData(data) {

        let res = {
            uid: g.userData.id,
            grade: Number(data[0]) === -1 ? -1 : Number(data[0]) + 1,
            college: "计算机学院",
        }

        for (let i = 2; i < data.length; i++) {
            let index = `question${i - 1}`;
            res[index] = Number(data[i]) === -1 ? -1 : Number(data[i]) + 1;
        }

        return res;
    },
})
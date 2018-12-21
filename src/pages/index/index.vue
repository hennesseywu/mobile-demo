<template>
  <div class="pullnew">
    <div class="head">
      <div class="back" >
        <span class="arrow"></span>
      </div>
      <div class="rule-button">
        活动说明
      </div>
    </div>
    <div class="title"></div>
    <div class="pullnew-title">
      <div class="share-button" ></div>
    </div>
    <div class="content">
      <div class="left-top-icon"></div>
      <div class="right-top-icon"></div>
      <div class="left-bottom-icon"></div>
      <div class="right-bottom-icon"></div>
      <div class="content-title">首次邀请好友即奖励10元现金</div>
      <div class="content-desc">之后每邀请1位奖励2元，如果您邀请了7位好友，那么第7位奖励您10元</div>
      <div class="progress-bg">
        <div v-for="(item,key,index) in pullNewStatic.invitedUsers" :key="key" :class="item.isGrey?'progress grey icon'+(index+1):'progress yellow icon'+(index+1)">
          <span class="progress-text">{{item.amount/100}}</span>元
        </div>
      </div>
      <div class="progress-desc">
        <div v-for="(value,key,index) in pullNewStatic.invitedUsers" :key="index" :class="index==0 ? 'progress-desc-text'+(index+1):'progress-desc-text'">{{key}}<span
            class="progress-ren">人</span></div>
      </div>
      <div class="share-title">
        <span class="share-text">分享快捷通道</span>
      </div>
      <div class="share">
        <div class="timeline" ></div>
        <div class="weixin" ></div>
        <div class="weibo" ></div>
        <div class="save-img" ></div>
      </div>
      <div class="share-tips">此活动需在最新版本客户端参与</div>
      <div class="balance">
        <div class="remain-money">奖金已到账 {{pullNewStatic.awardTotalAmt/100}}元</div>
        <div class="drawing" ></div>
      </div>
    </div>
    <div class="bottom">
      <div class="friends-list">
        <div class="remind-self" v-if="loginUsers.length>0">
          <img :src="fileUrl+loginUsers[0].inviteeUser.avatar" class="headphoto">
          <div class="info">
            <div class="name">{{loginUsers[0].inviteeUser.fullname}}</div>
            <div class="name">{{formateDate(loginUsers[0].inviteeUser.createTime)}}</div>
          </div>
          <div class="amount" v-if="loginUsers[0].loginAmount">你今日获得 +{{loginUsers[0].loginAmount/100}}元</div>
          <div class="amount" v-else>你今日获得 0元</div>
        </div>
        <div class="line"></div>
        <div v-if="pullNewStatic.inviteUserTotalCount > 0">
          <div class="remind-title" v-if="pullNewStatic.awardEnd">
            恭喜你，奖金全部解冻了，再接再厉去邀请哦~
          </div>
          <div v-else>
            <div class="remind-title" v-if="pullNewStatic.inviteUserTotalCount==pullNewStatic.remindCount">
              已经提醒全部好友登录了，再去邀请几个朋友一起赚钱吧!
            </div>
            <div class="remind-title" v-else>
              您有{{pullNewStatic.todayNotLoginUserCount}}位好友今天未登录，提醒他们登录 每位好友登录为您解冻0.2元
            </div>
          </div>
        </div>
        <div class="remind-title" v-else>
          您还没有好友哦，快去邀请好友赚钱吧！
        </div>
        <mt-loadmore class="loadmore" v-if="!pullNewStatic.awardEnd&&loginUsers.length> 0" :bottom-method="loadBottom"
          :auto-fill="false" :bottom-all-loaded="allLoaded" :bottomPullText="bottomPullText" :bottomLoadingText="bottomLoadingText"
          :bottomDistance="bottomDistance" ref="loadmore">
          <div class="remind-content">
            <div class="friend" v-for="(value,key) in loginUsers" :key="key" v-if="key!=0">
              <div class="top">
                <img :src="fileUrl+value.inviteeUser.avatar" class="headphoto">
                <div class="info">
                  <div class="name">{{value.inviteeUser.fullname}}</div>
                  <div class="name">{{formateDate(value.inviteeUser.createTime)}}</div>
                </div>
                <div class="amount" v-if="value.loginAmount">+{{value.loginAmount/100}}</div>
                <div v-else :class="value.reminded ? 'reminded':'remind-login'"></div>
              </div>
              <div v-if="value.awardedCount==0&&typeof(value.step)!='undefined'">
                <div class="arrow">
                  <span class="progress-span">邀请进度</span>
                  <span class="arrow-right"></span>
                </div>
                <div class="middle" :id="'m'+key">
                  <div :class="value.step.step1 ? 'dot': 'dot-grey'"></div>
                  <div class="line"></div>
                  <div :class="value.step.step2 ||value.step.step3 ? 'dot': 'dot-grey'"></div>
                  <div class="line"></div>
                  <div :class="value.step.step3 ? 'dot': 'dot-grey'"></div>
                </div>
                <div class="progress-bottom" :id="'b'+key">
                  <span :class="value.step.step1 ? 'desc1 desc-active': 'desc1'">进入首页</span>
                  <span :class="value.step.step2 ||value.step.step3 ? 'desc2 desc-active': 'desc2'">查看1篇文章</span>
                  <span :class="value.step.step3? 'desc3 desc-active': 'desc3'">查看2篇文章</span>
                </div>
              </div>
            </div>
          </div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue"
import {Toast} from 'mint-ui';
import Router from '@/router'
  export default {
    name: "index",
    components: {},
    data() {
      return {
        pullNewStatic: {
          awardTotalAmt: 0,
          invitedUsers: {
            "1": {
              amount: 1000,
              isGrey: true
            },
            "2": {
              amount: 200,
              isGrey: true
            },
            "3": {
              amount: 200,
              isGrey: true
            },
            "4": {
              amount: 200,
              isGrey: true
            },
            "5": {
              amount: 200,
              isGrey: true
            },
            "6": {
              amount: 200,
              isGrey: true
            },
            "7": {
              amount: 1000,
              isGrey: true
            }
          }

        },
        bottomDistance: 50,
        bottomPullText: '上拉加载更多',
        bottomLoadingText: '加载中',
        redbagVisiable: false,
        allLoaded: false,
        allLoaded1: false,
        inviteUsers: [],
        loginUsers: [],
        pageNum: 1,
        pageSize: 10,
        totalPageNum: 0,
        isLogin: false,
        tabActive: 'tabLeft',
        fileUrl: ''
      }
    },
    async mounted() {
      Toast
    },
    computed: {

    },
    methods: {

    }
  }
</script>
<style lang="less" scoped>
  .pullnew {
    background: url("~images/bg.png") no-repeat center;
    background-size: cover;
    padding-top: 120pr;
    text-align: center;
    height: 100%;
    .head {
      .back {
        color: #ffffff;
        width: 120pr;
        margin-bottom: 30pr;

        .arrow:after {
          content: '';
          display: inline-block;
          width: 24pr;
          height: 24pr;
          border-top: 3pr solid #ffffff;
          border-right: 3pr solid #ffffff;
          transform: rotate(225deg);
          -webkit-transform: rotate(225deg);
        }
      }
    }

    .rule-button {
      background: url("~images/rule-button.png") no-repeat center;
      width: 176pr;
      height: 70pr;
      background-size: cover;
      padding: 10pr 0 0 27pr;
      font-size: 15px;
      color: #ffffff;
      float: right;
      margin-top: -70pr;
    }

    .title {
      background: url("~images/title.png") no-repeat center;
      width: 464pr;
      height: 83pr;
      margin: 0 auto;
      background-size: cover;
    }

    .pullnew-title {
      background: url("~images/house.png") no-repeat center;
      background-size: cover;
      width: 650pr;
      height: 205pr;
      margin: 24pr auto 0 auto;

      .share-button {
        background: url("~images/share-button.png") no-repeat center;
        width: 341pr;
        height: 109pr;
        margin: 0 auto;
        background-size: cover;
      }
    }

    .content {
      position: relative;
      height: 673pr;
      border: 6pr solid #000000;
      background: #ffffff;
      border-radius: 10pr;
      text-align: center;
      margin: -40pr 17pr 17pr 21pr;

      .left-top-icon {
        background: url("~images/icon1.png") no-repeat center;
        background-size: cover;
        width: 50pr;
        height: 70pr;
        position: absolute;
        left: 28pr;
        top: 25pr;
      }

      .right-top-icon {
        background: url("~images/icon2.png") no-repeat center;
        background-size: cover;
        width: 50pr;
        height: 70pr;
        position: absolute;
        right: 28pr;
        top: 25pr;
      }

      .left-bottom-icon {
        background: url("~images/icon3.png") no-repeat center;
        background-size: cover;
        width: 50pr;
        height: 70pr;
        position: absolute;
        left: 28pr;
        bottom: 9pr;
      }

      .right-bottom-icon {
        background: url("~images/icon4.png") no-repeat center;
        background-size: cover;
        width: 50pr;
        height: 70pr;
        position: absolute;
        right: 28pr;
        bottom: 9pr;
      }

      .content-title {
        font-size: 18px;
        color: #222222;
        margin: 30pr 0 30pr 0;
      }

      .content-desc {
        font-size: 14px;
        color: #454545;
        margin: 0 30pr 25pr 30pr;
      }

      .progress-bg {
        background: url("~images/progress-bg.png") no-repeat center;
        background-size: cover;
        width: 668pr;
        height: 82pr;
        margin: 0 auto;
        display: flex;
        font-size:8px;
        flex-direction: row;

        .progress {
          width: 64pr;
          height: 64pr;
          line-height: 64pr;
          border-radius: 64pr;
          text-align: center;
        }

        .icon1 {
          margin: 9pr 35pr 9pr 9pr;
        }

        .icon2 {
          margin: 9pr 35pr 9pr 0;
        }

        .icon3 {
          margin: 9pr 35pr 9pr 0;
        }

        .icon4 {
          margin: 9pr 35pr 9pr 0;
        }

        .icon5 {
          margin: 9pr 35pr 9pr 0;
        }

        .icon6 {
          margin: 9pr 35pr 9pr 0;
        }

        .icon7 {
          margin: 9pr 8pr 9pr 0;
        }

        .yellow {
          background-color: #fedc21;
        }

        .grey {
          background-color: #dcdcdc;
        }

        .progress-text {
          color: #222222;
          font-size: 10px;
        }
      }

      .progress-desc {
        display: flex;
        flex-direction: row;
        justify-content: center;
        color: #454545;
        font-size: 20px;
        margin: 18pr 21pr 40pr 21pr;
        text-align: center;

        >div {
          width: 80pr;
          margin-left: 20pr;
        }

        .progress-desc-text1 {
          width: 80pr;
          margin-left: 0;
        }

        .progress-ren {
          font-size:10px
        }
      }

      .share-title {
        margin: 40pr 0 36pr 0;
        height: 1pr;
        border-top: 1pr solid #ddd;
        text-align: center;
        font-size: 14px;
        color: #1f1b1b;

        .share-text {
          position: relative;
          top: -18pr;
          background: #fff;
          padding: 0 20pr;
        }
      }

      .share {
        margin-top: 23pr;
        display: flex;
        flex-direction: row;
        justify-content: center;

        .timeline {
          background: url("~images/timeline.png") no-repeat center;
          background-size: cover;
          margin-right: 84pr;
          width: 62pr;
          height: 62pr;
        }

        .weixin {
          background: url("~images/weixin.png") no-repeat center;
          background-size: cover;
          margin-right: 81pr;
          width: 81pr;
          height: 62pr;
        }

        .weibo {
          background: url("~images/weibo.png") no-repeat center;
          background-size: cover;
          margin-right: 77pr;
          width: 80pr;
          height: 62pr;
        }

        .save-img {
          background: url("~images/save-img.png") no-repeat center;
          background-size: cover;
          width: 62pr;
          height: 62pr;
        }
      }

      .share-tips {
        margin-top: 20pr;
        font-size: 10px;
        color: #747474;
      }

      .balance {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 20pr;

        .remain-money {
          color: #212121;
          font-size: 16x;
          margin: 15pr 20pr 0 0;
        }

        .drawing {
          background: url("~images/drawing.png") no-repeat center;
          background-size: cover;
          width: 197pr;
          height: 78pr;
        }
      }
    }

    .bottom {
      background-color: #025182;
      padding-bottom: 48pr;

      .friends-list {
        flex-shrink: 1;
        background: #1570A9;
        margin: 0 17pr 0 21pr;
        border: 6pr solid #000000;
        border-radius: 0 0 10pr 10pr;

        .remind-self {
          color: #ACDFFF;
          margin-top: 20pr;
          display: flex;
          flex-direction: row;

          .headphoto {
            width: 87pr;
            height: 87pr;
            margin-left: 23pr;
          }

          .info {
            width: 308pr;
            display: flex;
            flex-direction: column;
            margin-left: 20pr;

            .name {
              font-size: 14px;
              margin-right: 20pr;
            }
          }

          .amount {
            width: 350pr;
            height: 96pr;
            text-align: center;
            font-size: 14px;
            margin-top: 15pr;
          }
        }

        .line {
          margin: 10pr 43pr 20pr 39pr;
        }

        .remind-title {
          color: #ACDFFF;
          width: 700pr;
          border-bottom: 6pr solid #000000;
          padding: 0pr 0pr 27pr 0pr;
          background-color: #1570A9;
          text-align: center;
          font-size: 14px;
          line-height: 50pr;
        }

        .loadmore {
          background-color: #DC214C;
          padding-bottom: 83pr;
          .remind-content {
            .friend {
              position: relative;
              margin-top: 41pr;
              color: #ffffff;

              .top {
                display: flex;
                flex-direction: row;

                .headphoto {
                  width: 87pr;
                  height: 87pr;
                  margin-left: 23pr;
                }

                .info {
                  width: 300pr;
                  display: flex;
                  flex-direction: column;
                  margin-left: 20pr;

                  .name {
                    font-size: 14px;
                    margin-right: 20pr;
                  }
                }

                .amount {
                  width: 225pr;
                  height: 96pr;
                  text-align: center;
                  font-size:16px;
                  margin-top: 15pr;
                }

                .reminded {
                  position: absolute;
                  width: 225pr;
                  height: 96pr;
                  right: 18pr;
                  background: url("~images/reminded.png") no-repeat center;
                  background-size: cover;
                }

                .remind-login {
                  position: absolute;
                  width: 225pr;
                  height: 96pr;
                  right: 18pr;
                  background: url("~images/remind-login.png") no-repeat center;
                  background-size: cover;
                }
              }

              .middle {
                display: none;
                flex-direction: row;
                margin: 17pr 102pr 17pr 102pr;

                .dot {
                  background: url(~images/dot1.png);
                  background-size: cover;
                  width: 33pr;
                  height: 33pr;
                }

                .dot-grey {
                  background: url(~images/dot2.png);
                  background-size: cover;
                  width: 33pr;
                  height: 33pr;
                }

                .line {
                  margin: 12pr 2pr 12pr 2pr;
                  width: 209pr;
                  height: 2pr;
                  border: 2pr dashed #313131;
                  width: 200pr;
                }
              }

              .progress-bottom {
                display: none;
                font-size: 14px;
                color: #FFC4D1;

                .desc-active {
                  color: #ffffff;
                }

                .desc1 {
                  margin-left: 50pr;
                  margin-right: 100pr;
                }

                .desc2 {
                  margin-right: 76pr;
                }

                .desc3 {
                  margin-right: 23pr;
                }
              }

              .arrow {
                text-align: left;
                margin-top: 10pr;
                .progress-span {
                  font-size: 14px;
                  color: #FDE9EE;
                  margin: 10pr 10pr 0 31pr;
                }

                .arrow-right:after {
                  content: '';
                  display: inline-block;
                  width: 14pr;
                  height: 14pr;
                  border-top: 2pr solid #ffffff;
                  border-right: 2pr solid #ffffff;
                  transform: rotate(45deg);
                  -webkit-transform: rotate(45deg);
                }

                .arrow-down:after {
                  content: '';
                  display: inline-block;
                  width: 14pr;
                  height: 14pr;
                  border-top: 2pr solid #ffffff;
                  border-right: 2pr solid #ffffff;
                  transform: rotate(135deg);
                  -webkit-transform: rotate(135deg);
                }
              }
            }

            .new-friend {
              background-color: #DC214C;
              padding-top: 30pr;

              .top {
                font-size: 13px;
                color: #fde9ee;
                display: flex;
                flex-direction: row;

                .headphoto {
                  width: 60pr;
                  height: 60pr;
                  border-radius: 60pr;
                  margin-left: 20pr;
                }

                .nickname {
                  text-align: left;
                  margin-left: 19pr;
                  width: 424pr;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
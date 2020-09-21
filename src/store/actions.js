import Axios from "axios";

import {SAVE_USER_STATUS} from './mutation-types'

export default {
    changeUserBlock(context,res){
        context.commit("changeUserBlock",res);
    },
    saveRole({commit},userInfo) {//保存登录用户信息
        commit(SAVE_USER_STATUS,userInfo);
    }
}


import {SAVE_USER_STATUS} from './mutation-types'

export default {
    getdata(state,res){
        state.data = res
    },
    changeUserBlock(state,res){
        state.userBlock=res
    },
    changeBus(state,business){
        state.userInfo.business = business;
    },
    saveStoreId(state,storeId){
        state.storeId = storeId;
    },
    [SAVE_USER_STATUS] (state,userInfo) {
        state.userInfo = userInfo
        console.log(state.userInfo);
    }
}

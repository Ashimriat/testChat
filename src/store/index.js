import Vue from "vue";
import Vuex from "vuex";
import generalModule from "./modules/general";
import roomsModule from "./modules/rooms";
import socketModule from "./modules/socket";
import userModule from "./modules/user";
import { GENERAL_MODULE, ROOMS_MODULE, SOCKET_MODULE, USER_MODULE } from "./modulesNames";


Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		[GENERAL_MODULE]: generalModule,
		[ROOMS_MODULE]: roomsModule,
		[SOCKET_MODULE]: socketModule,
		[USER_MODULE]: userModule
	}
});

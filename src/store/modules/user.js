import actions from "../actions";
import mutations, {TOGGLE_LOADER} from "../mutations";
import { MODAL_TYPES, STORAGE_KEYS } from "../../constants";
import { GENERAL_MODULE, SOCKET_MODULE } from "../modulesNames";


const {
	USER: {
		DEFINE_USER, LOGOUT_USER, OBTAIN_USER_FROM_STORAGE
	}
} = actions;
const {
	SOCKET: {
		DISCONNECT_SOCKET
	},
	USER: {
		SET_USER_NAME
	},
	GENERAL: {
		SET_MODAL
	}
} = mutations;

export default {
	namespaced: true,
	state: () => ({
		userName: ''
	}),
	mutations: {
		[SET_USER_NAME](state, userName) {
			state.userName = userName;
		},
	},
	actions: {
		[OBTAIN_USER_FROM_STORAGE]({ commit }) {
			const userName = localStorage.getItem(STORAGE_KEYS.userName);
			commit(`${GENERAL_MODULE}/${SET_MODAL}`, MODAL_TYPES.login, { root: true });
			if (userName) {
				commit(SET_USER_NAME, userName);
			}
		},
		[DEFINE_USER]({ commit }, userName) {
			localStorage.setItem(STORAGE_KEYS.userName, userName);
			commit(SET_USER_NAME, userName);
		},
		[LOGOUT_USER]({ commit }) {
			localStorage.removeItem(STORAGE_KEYS.userName);
			commit(`${SOCKET_MODULE}/${DISCONNECT_SOCKET}`, null, { root: true });
			commit(SET_USER_NAME, '');
			commit(`${GENERAL_MODULE}/${SET_MODAL}`, MODAL_TYPES.login, { root: true });
		},
	}
};

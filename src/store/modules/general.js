import mutations from "../mutations";
import actions from "../actions";
import {API, DEFAULT_SERVER_SETTINGS, ERRORS_TYPES} from "../../constants";

const {
	GENERAL: {
		LOAD_SETTINGS
	}
} = actions;
const {
	GENERAL: {
		SET_ERROR, SET_MODAL, TOGGLE_LOADER, SET_SERVER_SETTINGS
	}
} = mutations;

export default {
	namespaced: true,
	state: () => ({
		modal: null,
		error: null,
		serverSettings: {},
		isLoading: false
	}),
	mutations: {
		[SET_SERVER_SETTINGS](state, settings) {
			state.serverSettings = settings;
		},
		[SET_MODAL](state, modalName) {
			state.modal = modalName;
		},
		[SET_ERROR](state, error) {
			state.error = error;
		},
		[TOGGLE_LOADER](state) {
			state.isLoading = !state.isLoading;
		}
	},
	actions: {
		async [LOAD_SETTINGS]({ commit }) {
			let settings;
			try {
				const data = await fetch(API.SETTINGS);
				const {
					result: {
						max_message_length, max_room_title_length, max_username_length
					}
				} = await data.json();
				settings = {
					maxMessageLength: max_message_length,
					maxRoomNameLength: max_room_title_length,
					maxUserNameLength: max_username_length
				}
			} catch (e) {
				commit(SET_ERROR, ERRORS_TYPES.settingsLoadFailed);
				settings = DEFAULT_SERVER_SETTINGS;
			}
			commit(SET_SERVER_SETTINGS, settings);
		},
	}
}

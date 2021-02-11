import actions from "../actions";
import mutations from "../mutations";
import getters from "../getters";
import { API, ERRORS_TYPES, STORAGE_KEYS } from "../../constants";
import { formMessage, formRoom, formRoomsOrderData } from "../../utils";
import { GENERAL_MODULE } from "../modulesNames";


const {
	ROOMS: {
		INIT_ROOMS_LIST, LOAD_ROOM_MESSAGES,
		LOAD_ROOMS_LIST, SELECT_ROOM,
		UPDATE_ROOMS_ORDER_INFO, USER_CREATE_ROOM
	}
} = actions;
const {
	ROOMS: {
		ADD_MESSAGE, CREATE_ROOM,
		MARK_ROOM_CHECKED, SET_ACTIVE_ROOM,
		SET_ROOM_MESSAGES,
		SET_ROOMS, TOGGLE_ROOM_UNREAD
	},
	GENERAL: {
		SET_ERROR, TOGGLE_LOADER
	}
} = mutations;
const {
	ROOMS: {
		ACTIVE_ROOM, GET_ROOM_INDEX_BY_NAME, GET_ROOM_INDEX_BY_ID
	}
} = getters;

export default {
	namespaced: true,
	state: () => ({
		rooms: [],
		activeRoomId: null,
	}),
	mutations: {
		[SET_ROOMS](state, roomsList) {
			state.rooms = roomsList;
		},
		[SET_ROOM_MESSAGES](state, { messages, roomIndex }) {
			const editedRoom = state.rooms[roomIndex];
			editedRoom.messages.push(...messages);
		},
		[SET_ACTIVE_ROOM](state, roomId) {
			state.activeRoomId = roomId;
		},
		[CREATE_ROOM](state, { room, lastMessage }) {
			const newRoom = room;
			if (lastMessage) {
				newRoom.lastMessage = lastMessage;
				newRoom.messages.push(lastMessage);
			}
			state.rooms.push(newRoom);
		},
		[ADD_MESSAGE](state, { messageData, roomIndex, withPush }) {
			const editedRoom = state.rooms[roomIndex];
			if (withPush) editedRoom.messages.push(messageData);
			editedRoom.lastMessage = messageData;
		},
		[TOGGLE_ROOM_UNREAD](state, roomIndex) {
			const editedRoom = state.rooms[roomIndex];
			editedRoom.isUnread = !editedRoom.isUnread;
		},
		[MARK_ROOM_CHECKED](state, roomIndex) {
			const editedRoom = state.rooms[roomIndex];
			editedRoom.isChecked = true;
		},
	},
	actions: {
		async [LOAD_ROOMS_LIST]({ dispatch, commit }) {
			const data = await fetch(API.ROOMS);
			try {
				const { result: roomsList } = await data.json();
				if (roomsList && roomsList.length) {
					dispatch(INIT_ROOMS_LIST, roomsList);
				} else {
					commit(`${GENERAL_MODULE}/${SET_ERROR}`, ERRORS_TYPES.noRoomsList, { root: true });
				}
			} catch (e) {
				commit(`${GENERAL_MODULE}/${SET_ERROR}`, ERRORS_TYPES.noRoomsList, { root: true });
			}
		},
		[INIT_ROOMS_LIST]({ commit }, roomsList) {
			let roomsOrderData = localStorage.getItem(STORAGE_KEYS.rooms);
			let formedRoomsList = roomsList.map(formRoom);
			if (!roomsOrderData) {
				// если у нас нет данных по комнатам - просто формируем их и записываем
				roomsOrderData = formedRoomsList.map(formRoomsOrderData);
				localStorage.setItem(STORAGE_KEYS.rooms, JSON.stringify(roomsOrderData));
			} else {
				// в противном случае - сортируем по порядку, аналогичному прошлой загрузке,
				// после чего заносим обновленную инфу
				let indexA, indexB;
				roomsOrderData = JSON.parse(roomsOrderData);
				formedRoomsList.sort(({ name: nameA }, { name: nameB }) => {
					indexA = roomsOrderData.findIndex(({ name }) => name === nameA);
					indexB = roomsOrderData.findIndex(({ name }) => name === nameB);
					if (indexA === -1 || indexB === -1) {
						return 1;
					}
					return indexA - indexB;
				});
				formedRoomsList = formedRoomsList.map((roomData, roomIndex) => ({
					...roomData,
					id: roomIndex > roomsOrderData.length - 1 ? roomData.id : roomsOrderData[roomIndex].id,
					color: roomIndex > roomsOrderData.length - 1 ? roomData.color : roomsOrderData[roomIndex].color,
				}));
				roomsOrderData = formedRoomsList.map(formRoomsOrderData);
				localStorage.setItem(STORAGE_KEYS.rooms, JSON.stringify(roomsOrderData));
			}
			commit(SET_ROOMS, formedRoomsList);
		},
		[UPDATE_ROOMS_ORDER_INFO](context, room) {
			let roomsOrderInfo = localStorage.getItem(STORAGE_KEYS.rooms);
			roomsOrderInfo = roomsOrderInfo ? JSON.parse(roomsOrderInfo) : [];
			roomsOrderInfo.push(formRoomsOrderData(room));
			localStorage.setItem(STORAGE_KEYS.rooms, JSON.stringify(roomsOrderInfo));
		},
		async [LOAD_ROOM_MESSAGES]({ commit, getters }, { roomName, roomIndex }) {
			let timerId;
			const requestUrl = API.ROOM_MESSAGES.replace(/%ROOM%/, roomName);
			commit(`${GENERAL_MODULE}/${TOGGLE_LOADER}`, null, { root: true });
			try {
				const data = await fetch(requestUrl);
				const { result } = await data.json();
				if (result) {
					const messages = result.map(formMessage);
					commit(SET_ROOM_MESSAGES, { messages, roomIndex });
				} else {
					commit(`${GENERAL_MODULE}/${SET_ERROR}`, ERRORS_TYPES.noMessagesHistory, { root: true });
				}
			} catch (e) {
				commit(`${GENERAL_MODULE}/${SET_ERROR}`, ERRORS_TYPES.noMessagesHistory, { root: true });
			}
			// откладываю прогрузку, чтобы не было дерганий интерфейса
			timerId = setTimeout(() => {
				commit(`${GENERAL_MODULE}/${TOGGLE_LOADER}`, null, { root: true });
				commit(MARK_ROOM_CHECKED, roomIndex);
				clearTimeout(timerId);
			}, 2000);
		},
		[SELECT_ROOM]({ state, commit, dispatch, getters }, { id, name }) {
			const editedRoomIndex = getters[GET_ROOM_INDEX_BY_ID](id);
			commit(SET_ACTIVE_ROOM, id);
			if (state.rooms[editedRoomIndex].isUnread) {
				commit(TOGGLE_ROOM_UNREAD, editedRoomIndex);
			}
			if (!state.rooms[editedRoomIndex].messages.length) {
				dispatch(LOAD_ROOM_MESSAGES, { roomName: name, roomIndex: editedRoomIndex });
			}
		},
		[USER_CREATE_ROOM]({ commit, dispatch }, name) {
			const room = formRoom({ name });
			dispatch(UPDATE_ROOMS_ORDER_INFO, room);
			commit(CREATE_ROOM, { room });
			commit(SET_ACTIVE_ROOM, room.id);
		}
	},
	getters: {
		[ACTIVE_ROOM]: state => state.rooms.find(({ id }) => id === state.activeRoomId),
		[GET_ROOM_INDEX_BY_NAME]: state => name => state.rooms.findIndex(({ originName }) => name === originName),
		[GET_ROOM_INDEX_BY_ID]: state => roomId => state.rooms.findIndex(({ id }) => roomId === id)
	}
}

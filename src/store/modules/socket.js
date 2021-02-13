import actions from "../actions";
import mutations from "../mutations";
import getters from "../getters";
import {
  API, ERRORS_TYPES, MODAL_TYPES,
  APP_SETTINGS, PING_MESSAGE_OBJ
} from "../../constants";
import { formMessage, formRoom } from "../../utils";
import { GENERAL_MODULE, ROOMS_MODULE } from "../modulesNames";


const {
  SOCKET: {
    CONFIGURE_SOCKET,
    CONNECT_SOCKET,
    PING_SOCKET,
    PROCESS_SOCKET_MESSAGE,
    SEND_MESSAGE,
  },
  ROOMS: {
    UPDATE_ROOMS_ORDER_INFO
  }
} = actions;
const {
  SOCKET: {
    CREATE_SOCKET, DISCONNECT_SOCKET,
    VERIFY_SOCKET_CONNECTION
  },
  ROOMS: {
    ADD_MESSAGE, CREATE_ROOM, TOGGLE_ROOM_UNREAD,
  },
  GENERAL: {
    SET_ERROR, SET_MODAL, TOGGLE_LOADER,
  }
} = mutations;
const {
  ROOMS: {
    ACTIVE_ROOM, GET_ROOM_INDEX_BY_NAME
  }
} = getters;


let socketMessageHandler;

export default {
  namespaced: true,
  state: () => ({
    socket: null,
    isConnected: false
  }),
  mutations: {
    [CREATE_SOCKET](state) {
      state.socket = new WebSocket(API.SOCKET + state.userName);
    },
    [DISCONNECT_SOCKET](state) {
      state.socket.removeEventListener('message', socketMessageHandler);
      state.socket = null;
      state.isConnected = false;
    },
    [VERIFY_SOCKET_CONNECTION](state) {
      state.isConnected = true;
    },
  },
  actions: {
    async [CONNECT_SOCKET]({ state, dispatch, commit }) {
      // поднимаем лоадер
      commit(`${GENERAL_MODULE}/${TOGGLE_LOADER}`, null, { root: true });
      // создаем сокет
      commit(CREATE_SOCKET);
      // коннектим его
      try {
	await new Promise((res, rej) => {
	  let timerId, counter = 0;
	  const tracker = () => {
	    clearTimeout(timerId);
	    if (state.socket.readyState === WebSocket.OPEN) {
	      res();
	    } else if (++counter <= APP_SETTINGS.socketReconnectsAmount) {
	      timerId = setTimeout(tracker, APP_SETTINGS.socketReconnectTimer);
	    } else {
	      rej();
	    }
	  };
	  tracker();
	});
	// при успешном коннекте - пингуем
	dispatch(PING_SOCKET);
      } catch (e) {
	commit(`${GENERAL_MODULE}/${SET_MODAL}`, MODAL_TYPES.login, { root: true });
	commit(`${GENERAL_MODULE}/${SET_ERROR}`, ERRORS_TYPES.noSocketConnect, { root: true });
      }
    },
    async [PING_SOCKET]({ state, commit, dispatch }) {
      if (APP_SETTINGS.withSocketPingCheck) {
	let timerId, isPonged = false, pingsCounter = 0;
	const pingHandler = ({ data }) => {
	  if (!JSON.parse(data).pong) return ;
	  isPonged = true;
	};
	state.socket.addEventListener('message', pingHandler);
	try {
	  await new Promise((res, rej) => {
	    const pinger = () => {
	      clearTimeout(timerId);
	      if (isPonged) {
	        state.socket.removeEventListener('message', pingHandler);
		commit(VERIFY_SOCKET_CONNECTION);
		dispatch(CONFIGURE_SOCKET);
		res();
	      } else if (++pingsCounter <= APP_SETTINGS.socketPingsAmount) {
		state.socket.send(JSON.stringify(PING_MESSAGE_OBJ));
		timerId = setTimeout(pinger, APP_SETTINGS.socketRePingTimer);
	      } else {
		rej();
	      }
	    };
	    pinger();
	  });
	} catch (e) {
	  commit(`${GENERAL_MODULE}/${SET_ERROR}`, ERRORS_TYPES.noSocketPong, { root: true });
	} finally {
	  commit(`${GENERAL_MODULE}/${TOGGLE_LOADER}`, null, { root: true });
	}
      } else {
	commit(VERIFY_SOCKET_CONNECTION);
	commit(`${GENERAL_MODULE}/${TOGGLE_LOADER}`, null, { root: true });
	commit(`${GENERAL_MODULE}/${SET_MODAL}`, null, { root: true });
	dispatch(CONFIGURE_SOCKET);
      }
    },
    [CONFIGURE_SOCKET]({ state, dispatch }) {
      socketMessageHandler = ({ data }) => {
	const { created, room, sender, text} = JSON.parse(data);
	const messageData = formMessage({ created, sender, text });
	dispatch(PROCESS_SOCKET_MESSAGE, { messageData, roomName: room });
      };
      state.socket.addEventListener('message', socketMessageHandler);
    },
    [PROCESS_SOCKET_MESSAGE]({ state, commit, dispatch, rootState, rootGetters }, { messageData, roomName }) {
      // находим комнату, для которой пришло сообщение
      const editedRoomIndex = rootGetters[`${ROOMS_MODULE}/${GET_ROOM_INDEX_BY_NAME}`](roomName);
      if (editedRoomIndex !== -1) {
	// если комната уже существует - отправляем сообщение в нее
	const { id, isUnread, messages } = rootState[ROOMS_MODULE].rooms[editedRoomIndex];
	const isActiveRoom = id === rootState[ROOMS_MODULE].activeRoomId;
	commit(`${ROOMS_MODULE}/${ADD_MESSAGE}`, {
	  messageData,
	  roomIndex: editedRoomIndex,
	  // нет сиысла пушить сообщение, если история комнаты еще не была загружена и комната не активна
	  withPush: messages.length || isActiveRoom
	}, { root: true });
	// отмечаем комнату непрочитанной, если она не является текущей активной комнатой
	if (!isActiveRoom && !isUnread) {
	  commit(`${ROOMS_MODULE}/${TOGGLE_ROOM_UNREAD}`, editedRoomIndex, { root: true });
	}
      } else {
	const room = formRoom({ name: roomName });
	dispatch(`${ROOMS_MODULE}/${UPDATE_ROOMS_ORDER_INFO}`, room, { root: true });
	// в противном случае - создаем комнату
	commit(`${ROOMS_MODULE}/${CREATE_ROOM}`, { room, lastMessage: messageData }, { root: true });
      }
    },
    [SEND_MESSAGE]({ state, dispatch, commit, rootGetters }, message) {
      const { name: activeRoomName } = rootGetters[`${ROOMS_MODULE}/${ACTIVE_ROOM}`];
      try {
	state.socket.send(JSON.stringify({
	  room: activeRoomName,
	  text: message
	}));
      } catch (e) {
	commit(`${GENERAL_MODULE}/${SET_ERROR}`, ERRORS_TYPES.messageNotSent, { root: true });
      }
    },
  }
}

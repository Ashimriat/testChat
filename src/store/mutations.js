export const CREATE_SOCKET = 'CREATE_SOCKET';
export const CREATE_ROOM = 'CREATE_ROOM';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const VERIFY_SOCKET_CONNECTION = 'VERIFY_SOCKET_CONNECTION';
export const SET_SERVER_SETTINGS = 'SET_SERVER_SETTINGS';
export const SET_ROOMS = 'SET_ROOMS';
export const SET_ROOM_MESSAGES = 'SET_ROOM_MESSAGES';
export const SET_ACTIVE_ROOM = 'SET_ACTIVE_ROOM';
export const TOGGLE_ROOM_UNREAD = 'TOGGLE_ROOM_UNREAD';
export const SET_USER_NAME = 'SET_USER_NAME';
export const DISCONNECT_SOCKET = 'DISCONNECT_SOCKET';
export const SET_MODAL = 'SET_MODAL';
export const SET_ERROR = 'SET_ERROR';
export const MARK_ROOM_CHECKED = 'MARK_ROOM_CHECKED';
export const TOGGLE_LOADER = 'TOGGLE_LOADER';

export default {
	USER: {
		SET_USER_NAME: 'SET_USER_NAME'
	},
	SOCKET: {
		CREATE_SOCKET: 'CREATE_SOCKET',
		VERIFY_SOCKET_CONNECTION: 'VERIFY_SOCKET_CONNECTION',
		DISCONNECT_SOCKET: 'DISCONNECT_SOCKET'
	},
	ROOMS: {
		SET_ROOMS: 'SET_ROOMS',
		SET_ROOM_MESSAGES: 'SET_ROOM_MESSAGES',
		SET_ACTIVE_ROOM: 'SET_ACTIVE_ROOM',
		CREATE_ROOM: 'CREATE_ROOM',
		ADD_MESSAGE: 'ADD_MESSAGE',
		TOGGLE_ROOM_UNREAD: 'TOGGLE_ROOM_UNREAD',
		MARK_ROOM_CHECKED: 'MARK_ROOM_CHECKED'
	},
	GENERAL: {
		SET_SERVER_SETTINGS: 'SET_SERVER_SETTINGS',
		SET_MODAL: 'SET_MODAL',
		SET_ERROR: 'SET_ERROR',
		TOGGLE_LOADER: 'TOGGLE_LOADER'
	}
};

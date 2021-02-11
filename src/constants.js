export const API = {
	SOCKET: 'wss://nane.tada.team/ws?username=',
	SETTINGS: 'https://nane.tada.team/api/settings',
	ROOMS: 'https://nane.tada.team/api/rooms',
	ROOM_MESSAGES: 'https://nane.tada.team/api/rooms/%ROOM%/history'
};

export const STORAGE_KEYS = {
	userName: 'testChatUserName',
	rooms: 'testChatRooms'
};

export const MODAL_CONTENT = {
	LogIn: {
		title: 'Введите ваше имя пользователя',
		buttonText: 'Войти',
		buttonHandler: 'logIn',
		maxInputLength: 'maxUserNameLength',
		isClosable: false
	},
	CreateRoom: {
		title: 'Введите название комнаты',
		buttonText: 'Создать',
		buttonHandler: 'makeRoom',
		maxInputLength: 'maxRoomNameLength',
		isClosable: true
	}
};

export const MODAL_TYPES = {
	login: 'LogIn',
	createRoom: 'CreateRoom',
};

export const EVENTS = {
	roomCreated: 'roomCreated',
	loadAppData: 'loadAppData',
	showTip: 'showTip',
	hideTip: 'hideTip'
};

export const DEFAULT_SERVER_SETTINGS = {
	maxMessageLength: 1000,
	maxRoomNameLength: 20,
	maxUserNameLength: 20
};


export const ERRORS_TYPES = {
	noRoomsList: 'noRoomsList',
	noMessagesHistory: 'noMessagesHistory',
	messageNotSent: 'messageNotSent',
	settingsLoadFailed: 'settingsLoadFailed',
	noSocketConnect: 'noSocketConnect',
	noSocketPong: 'noSocketPong'
};

export const KEYCODES = {
	ENTER: 13,
	SHIFT: 16
};

export const PING_MESSAGE_OBJ = { ping: true };

export const APP_SETTINGS = {
	withSocketPingCheck: false,
	socketPingsAmount: 5,
	socketRePingTimer: 1000,
	socketReconnectsAmount: 10,
	socketReconnectTimer: 1500
};

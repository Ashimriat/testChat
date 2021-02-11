export const clearXss = src => src.replace(/<script>(.*)<\/script>/g, '');

export const generateUUID = (M, N) => `xxxxxxxx-xxxx-${M}xxx-${N}xxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
	let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
	return v.toString(16);
});

export const generateColor = () => Math.floor(Math.random()*16777215).toString(16);

const makeDoubleNumDigit = src => src < 10 ? `0${src}` : src;

export const formDate = src => {
	const date = new Date(src);
	const year = date.getFullYear();
	const month = makeDoubleNumDigit(date.getMonth() + 1);
	const day = makeDoubleNumDigit(date.getDate());
	const hours = makeDoubleNumDigit(date.getHours());
	const minutes = makeDoubleNumDigit(date.getMinutes());
	return `${day}.${month}.${year}, ${hours}:${minutes}`;
};

export const formMessage = ({ created, sender: { username }, text }) => ({
	date: formDate(created),
	author: clearXss(username),
	message: clearXss(text),
	id: generateUUID(3, 'a')
});

export const formRoom = ({ name, last_message }) => {
	const res = {
		id: generateUUID(4, 'b'),
		isUnread: true,
		originName: name,
		color: generateColor(),
		name: name,
		messages: [],
		error: null,
		isChecked: false,
	};
	if (last_message) {
		res.lastMessage = formMessage(last_message);
	}
	return res;
};

export const formRoomsOrderData = ({ id, name, color }) => ({ id, name, color });

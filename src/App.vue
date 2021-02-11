<template lang="pug">
  .App(:class="rootClass")
    template(v-if="isConnected")
      TopPanel
      .App__serversList
        .App__servers
          | Серверы
      RoomsList
      .App__loaderContainer(v-if="isLoading")
        Loader
      template(v-else)
        ActiveRoom(v-if="activeRoomId")
        .App__noSelectedRoom(v-else)
          .App__selectRoomMessage
            | Выберите комнату или создайте свою. Общение не ждет!
        UserMessageInput
      RoomTip
    Modal(@loadAppData="loadAppData")
    ErrorNotify
</template>

<script>
  import { mapActions, mapState } from "vuex";
  import Modal from "./components/Modal";
  import TopPanel from "./components/TopPanel";
  import RoomsList from "./components/RoomsList";
  import ActiveRoom from "./components/ActiveRoom";
  import UserMessageInput from "./components/UserMessageInput";
  import RoomTip from "./components/RoomTip";
  import ErrorNotify from "./components/ErrorNotify";
  import Loader from "./components/Loader";
  import actions from "./store/actions";
  import { GENERAL_MODULE, ROOMS_MODULE, SOCKET_MODULE, USER_MODULE } from "./store/modulesNames";


  const {
    SOCKET: { CONNECT_SOCKET },
    ROOMS: { LOAD_ROOMS_LIST },
    USER: { OBTAIN_USER_FROM_STORAGE },
    GENERAL: { LOAD_SETTINGS }
  } = actions;

  export default {
    name: "App",
    components: {
      Loader,
      RoomsList, ActiveRoom, UserMessageInput,
      TopPanel, Modal, RoomTip, ErrorNotify
    },
    async mounted() {
      await this.loadSettings();
      this.loadUser();
      if (this.userName) {
	this.loadAppData();
      }
    },
    methods: {
      ...mapActions({
        loadSettings: `${GENERAL_MODULE}/${LOAD_SETTINGS}`,
        loadRoomsList: `${ROOMS_MODULE}/${LOAD_ROOMS_LIST}`,
        connectSocket: `${SOCKET_MODULE}/${CONNECT_SOCKET}`,
        loadUser: `${USER_MODULE}/${OBTAIN_USER_FROM_STORAGE}`
      }),
      async loadAppData() {
        await this.connectSocket();
        if (this.isConnected) {
          await this.loadRoomsList();
        }
      },
    },
    computed: {
      ...mapState({
        activeRoomId: state => state[ROOMS_MODULE].activeRoomId,
        userName: state => state[USER_MODULE].userName,
        isConnected: state => state[SOCKET_MODULE].isConnected,
        isLoading: state => state[GENERAL_MODULE].isLoading
      }),
      rootClass() {
      	return this.isConnected && this.isLoading ? 'App--withLoader' : '';
      }
    }
  }
</script>

<style lang="scss">
  body {
    margin: 0;
  }

  .App {
    display: grid;
    z-index: 1;
    position: relative;
    width: 100vw;
    height: 100vh;
    grid-template-areas:
      'topPanel topPanel topPanel'
      'servers roomsList room'
      'servers roomsList userMessage';
    grid-template-columns: 2fr 140px 12fr;
    grid-template-rows: 1fr 7fr 2fr;

    &--withLoader {
      grid-template-areas:
        'topPanel topPanel topPanel'
        'servers roomsList loader'
        'servers roomsList loader';
    }

    &__noSelectedRoom {
      grid-area: room;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__loaderContainer {
      grid-area: loader;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__selectRoomMessage {
      width: 80%;
      justify-content: center;
      align-items: center;
      font-size: 38px;
      word-break: break-word;
      text-align: center;
    }

    &__serversList {
      grid-area: servers;
      background-color: chocolate;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__servers {
      font-size: 28px;
      font-weight: 600;
      transform: rotate(-90deg);
      color: #ffffff;
    }

    &__roomMessages {
      grid-area: room;
    }
  }
</style>

<template lang="pug">
  .ActiveRoom(ref="activeRoomContainer")
    .ActiveRoom__title
      | Комната:
      |
      span
        | {{ roomData.name }}
    .ActiveRoom__noMessagesNotify(v-if="noHistoryMessage")
      | {{ noHistoryMessage }}
    template(v-else)
      .ActiveRoom__message(
        v-for="({ author, date, id, message }) in roomData.messages"
        :key="id"
      )
        .ActiveRoom__messageAuthorDate
          span
            | {{ author }}
          |
          | {{ date }}
        .ActiveRoom__messageText
          | {{ message }}
</template>

<script>
  import { mapGetters, mapState } from "vuex";
  import { GENERAL_MODULE, ROOMS_MODULE } from "../store/modulesNames";
  import getters from "../store/getters";


  const { ROOMS: { ACTIVE_ROOM } } = getters;

  export default {
    name: "ActiveRoom",
    mounted() {
      this.scrollToBottom();
    },
    methods: {
      async scrollToBottom() {
        await this.$nextTick();
        this.$refs.activeRoomContainer.scrollBy(0, this.$refs.activeRoomContainer.scrollHeight);
      }
    },
    computed: {
      ...mapGetters({
        roomData: `${ROOMS_MODULE}/${ACTIVE_ROOM}`
      }),
      ...mapState({
        isLoading: state => state[GENERAL_MODULE].isLoading
      }),
      noHistoryMessage() {
        if (this.roomData.isChecked && !this.roomData.messages.length) {
	  return 'В данной комнате еще нет сообщений.';
        } else if (!this.roomData.messages.length) {
	  return 'Здесь пока нет ни одного сообщения. Отправьте сообщение сейчас, или комната будет уничтожена при перезагрузке или закрытии страницы';
        } else {
	  return '';
        }
      }
    },
    watch: {
      ['roomData.messages']() {
	this.scrollToBottom();
      }
    }
  }
</script>

<style lang="scss">
  .ActiveRoom {
    grid-area: room;
    overflow-y: scroll;
    padding: 10px 0 0 10px;

    &__title {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;

      span {
        font-weight: 600;
        padding-left: 5px;
      }
    }

    &__noMessagesNotify {
      width: 100%;
      height: 96%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 30px;
    }

    &__message {
      height: fit-content;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &:not(&:last-child) {
        margin-bottom: 10px;
      }
    }

    &__messageAuthorDate {
      font-weight: bold;

      span {
        font-size: 20px;
        color: crimson;
      }
    }
  }
</style>

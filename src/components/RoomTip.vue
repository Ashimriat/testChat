<template lang="pug">
  .RoomTip(
    v-if="tipInfo"
    :style="{ left: tipInfo.x + 'px', top: tipInfo.y + 'px'}"
  )
    .RoomTip__text
      | Комната:
      |
      span
        | {{ tipInfo.roomName }}
    .RoomTip__text
      | Автор последнего сообщения:
      |
      span
        | {{ tipInfo.lastMessage.author }}
    .RoomTip__text
      | Дата:
      |
      span
        | {{ tipInfo.lastMessage.date }}
    .RoomTip__text
      | {{ tipInfo.lastMessage.message }}
    .RoomTip__text--unreadNotify(v-if="tipInfo.isUnread")
      | Есть непрочитанные сообщения!
</template>

<script>
  import { EVENTS } from "../constants";


  export default {
    name: "RoomTip",
    data() {
      return {
	tipInfo: null
      }
    },
    mounted() {
      this.$root.$on(EVENTS.showTip, this.showTip);
      this.$root.$on(EVENTS.hideTip, this.hideTip);
    },
    beforeDestroy() {
      this.$root.$off(EVENTS.showTip, this.showTip);
      this.$root.$off(EVENTS.hideTip, this.hideTip);
    },
    methods: {
      showTip({ e: { offsetX, pageX, offsetY, pageY }, roomData: { name, lastMessage, isUnread } }) {
        this.tipInfo = {
	  x: pageX - offsetX + 135,
	  y: pageY - offsetY + 15,
	  roomName: name,
	  lastMessage,
          isUnread
        };
      },
      hideTip() {
	this.tipInfo = null;
      }
    }
  }
</script>

<style lang="scss">
  .RoomTip {
    max-width: 200px;
    position: absolute;
    border-radius: 10px;
    border: 1px solid black;
    background-color: lightblue;
    padding: 8px;
    width: fit-content;

    &__text {
      &:not(&:last-child) {
        font-weight: 600;
      }

      span {
        font-weight: normal;
      }

      &--unreadNotify {
        color: red;
      }
    }
  }
</style>

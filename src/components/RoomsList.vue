<template lang="pug">
  .RoomsList
    .RoomsList__roomsContainer
      .RoomsList__room(
        v-for="({ id, name, color, lastMessage, isUnread }) in rooms"
        :key="id"
        :style="{ backgroundColor: '#' + color }"
        @mouseover="showTip($event, { id, name, lastMessage, isUnread })"
        @mouseout="hideTip"
        @click="selectRoom({ id, name })"
      )
        .RoomsList__activeRoomMark(v-if="id === activeRoomId")
        .RoomsList__unreadRoomMark(v-else-if="isUnread && lastMessage")
          | !
      .RoomsList__room.RoomsList__createRoomButton(@click="createRoom")
        | +
</template>

<script>
	import { mapState, mapActions, mapMutations } from "vuex";
  import actions from "../store/actions";
  import mutations from "../store/mutations";
	import { GENERAL_MODULE, ROOMS_MODULE } from "../store/modulesNames";
	import { EVENTS, MODAL_TYPES } from "../constants";

	const { ROOMS: { SELECT_ROOM } } = actions;
	const { GENERAL: { SET_MODAL } } = mutations;

  export default {
    name: "RoomsList",
    methods: {
    	...mapActions({
        selectRoom: `${ROOMS_MODULE}/${SELECT_ROOM}`
    	}),
      ...mapMutations({
        setModal: `${GENERAL_MODULE}/${SET_MODAL}`
      }),
      showTip(e, { id, name, lastMessage, isUnread }) {
    		if (id !== this.activeRoomId && lastMessage) {
			    this.$root.$emit(EVENTS.showTip, { e, roomData: { name, lastMessage, isUnread } });
		    }
      },
      hideTip() {
    		this.$root.$emit(EVENTS.hideTip);
      },
      createRoom() {
    		this.setModal(MODAL_TYPES.createRoom);
      }
    },
    computed: {
      ...mapState({
        rooms: state => state[ROOMS_MODULE].rooms,
        activeRoomId: state => state[ROOMS_MODULE].activeRoomId
      })
    }
  }
</script>

<style lang="scss">
  .RoomsList {
    grid-area: roomsList;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    overflow-y: scroll;

    &__roomsContainer {
      position: absolute;
      top: 5px;
      min-width: 85%;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__room {
      min-width: 100%;
      flex-basis: 100%;
      min-height: 120px;
      border-radius: 50%;
      cursor: pointer;
      border: 1px solid black;
      justify-content: center;
      align-items: center;
      display: flex;

      &:not(&:last-child) {
        margin-bottom: 10px;
      }
    }

    &__activeRoomMark {
      border-radius: 50%;
      width: 20px;
      height: 20px;
      background-color: crimson;
    }

    &__unreadRoomMark {
      color: red;
      font-size: 40px;
      width: 15px;
      background-color: white;
      border-radius: 15px;
    }

    &__createRoomButton {
      font-size: 40px;
    }
  }
</style>

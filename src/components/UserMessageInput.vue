<template lang="pug">
  .UserMessageInput
    textarea.UserMessageInput__messageField(
      ref="messageInput"
      placeholder="Введите ваше сообщение..."
      v-model="message"
      :maxlength="maxMessageLength"
      @focus="toggleFocus"
      @blur="toggleFocus"
    )
    .UserMessageInput__maxLengthNotify(v-if="message.length === maxMessageLength")
      | Максимально допустимая длина сообщения
</template>

<script>
  import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
  import actions from "../store/actions";
  import mutations from "../store/mutations";
  import getters from "../store/getters";
  import { EVENTS, MODAL_TYPES, KEYCODES } from "../constants";
  import { GENERAL_MODULE, ROOMS_MODULE, SOCKET_MODULE } from "../store/modulesNames";


  const { SOCKET: { SEND_MESSAGE } } = actions;
  const { GENERAL: { SET_MODAL } } = mutations;
  const { ROOMS: { ACTIVE_ROOM } } = getters;

  export default {
	  name: "UserMessageInput",
	  data() {
  		return {
  		  message: '',
        isTransferOnEnter: false,
        isInputFocused: false,
        isSendAllowed: false
      }
    },
    mounted() {
      window.addEventListener('keydown', this.keyDownHandler);
      window.addEventListener('keyup', this.keyUpHandler);
	    this.$root.$on(EVENTS.roomCreated, this.roomCreatedEventHandler);
    },
    methods: {
			...mapActions({
        sendMessage: `${SOCKET_MODULE}/${SEND_MESSAGE}`
			}),
      ...mapMutations({
        setModal: `${GENERAL_MODULE}/${SET_MODAL}`
      }),
      keyDownHandler({ keyCode }) {
				if (keyCode === KEYCODES.SHIFT) {
					this.isTransferOnEnter = true;
				} else if (keyCode === KEYCODES.ENTER) {
					const canSendMessage = this.message && !this.isTransferOnEnter && this.isInputFocused;
					if (canSendMessage) {
						this.processMessage();
          }
				}
      },
      keyUpHandler({ keyCode }) {
	      if (keyCode === KEYCODES.SHIFT) {
		      this.isTransferOnEnter = false;
	      }
      },
      roomCreatedEventHandler() {
	      if (this.message && this.isSendAllowed) {
	      	this.sendMessage(this.message);
	      	this.isSendAllowed = false;
	      }
      },
      toggleFocus() {
				this.isInputFocused = !this.isInputFocused;
      },
      processMessage() {
				if (this.activeRoom) {
				  this.sendMessage(this.message);
				  this.$refs.messageInput.value = '';
				  this.$refs.messageInput.blur();
        } else {
					this.isSendAllowed = true;
					this.setModal(MODAL_TYPES.createRoom);
        }
      }
    },
    computed: {
			...mapGetters([`${ROOMS_MODULE}/${ACTIVE_ROOM}`]),
      ...mapState({
	      maxMessageLength: state => state[GENERAL_MODULE].serverSettings.maxMessageLength
      })
    },
    beforeDestroy() {
	  	window.removeEventListener('keydown', this.keyDownHandler);
	    window.removeEventListener('keyup', this.keyUpHandler);
	    this.$root.$off(EVENTS.roomCreated, this.roomCreatedEventHandler);
    }
  }
</script>

<style lang="scss">
  .UserMessageInput {
    grid-area: userMessage;
    padding: 10px 0 0 10px;
    position: relative;

    &__messageField {
      display: flex;
      width: 100%;
      height: 100%;
      padding: 20px;
      font-size: 24px;
      box-sizing: border-box;

      &:focus {
        outline: none;
      }

      &::placeholder {
        font-size: 24px;
        opacity: 0.5;
      }
    }

    &__maxLengthNotify {
      color: brown;
      position: absolute;
      top: 15px;
      right: 15px;
    }
  }
</style>

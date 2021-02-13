<template lang="pug">
  .Modal(v-if="modal")
    .Modal__background
    .Modal__closeIcon(
      v-if="content.isClosable && !isLoading"
      @click="closeModal"
    )
    .Modal__content
      Loader(v-if="isLoading")
      template(v-else)
        .Modal__title
          | {{ content.title }}
        .Modal__maxLengthNotify(v-if="lengthWarn")
          | Достигнуто максимальное кол-во символов
        input.Modal__input(
          :maxlength="maxInputLength"
          v-model="inputValue"
        )
        button.Modal__button(
          :class="{ 'Modal__button--disabled': !inputValue }"
          @click="buttonHandler"
        )
          | {{ content.buttonText }}
</template>

<script>
  import { mapActions, mapMutations, mapState } from "vuex";
  import actions from "../store/actions";
  import mutations from "../store/mutations";
  import { GENERAL_MODULE, ROOMS_MODULE, USER_MODULE } from "../store/modulesNames";
  import {EVENTS, MODAL_CONTENT, MODAL_TYPES} from "../constants";
  import Loader from "./Loader";


  const { USER: { USER_CREATE_ROOM, DEFINE_USER } } = actions;
  const { GENERAL: { SET_MODAL } } = mutations;

  export default {
    name: "Modal",
    components: { Loader },
    data() {
      return {
	inputValue: '',
	content: {},
        lengthWarn: false
      }
    },
    methods: {
      ...mapActions({
	defineUser: `${USER_MODULE}/${DEFINE_USER}`,
        createRoom: `${ROOMS_MODULE}/${USER_CREATE_ROOM}`,
      }),
      ...mapMutations({
        setModal: `${GENERAL_MODULE}/${SET_MODAL}`
      }),
      buttonHandler() {
	this[this.content.buttonHandler]();
      },
      logIn() {
	this.defineUser(this.inputValue);
	this.$emit(EVENTS.loadAppData);
      },
      makeRoom() {
   	this.createRoom(this.inputValue);
    	this.$root.$emit(EVENTS.roomCreated);
    	this.closeModal();
      },
      closeModal() {
    	this.setModal(null);
      }
    },
    computed: {
      ...mapState({
        modal: state => state[GENERAL_MODULE].modal,
	maxUserNameLength: state => state[GENERAL_MODULE].serverSettings.maxUserNameLength,
	maxRoomNameLength: state => state[GENERAL_MODULE].serverSettings.maxRoomNameLength,
        isLoading: state => state[GENERAL_MODULE].isLoading,
        userName: state => state[USER_MODULE].userName
      }),
      maxInputLength() {
        return this[this.content?.maxInputLength] ?? 0;
      },
    },
    watch: {
      modal(newVal) {
	this.content = MODAL_CONTENT[newVal];
	if (!newVal) {
	  this.inputValue = '';
	  this.lengthWarn = false;
        } else if (newVal === MODAL_TYPES.login && this.userName) {
	  this.inputValue = this.userName;
        }
      },
      inputValue(newVal) {
	this.lengthWarn = this.maxInputLength ? newVal.length === this.maxInputLength : false;
      }
    }
  }
</script>

<style lang="scss">
  .Modal {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 2;

    &__background {
      background-color: black;
      opacity: 0.6;
      width: 100vw;
      height: 100vh;
      position: absolute;
      z-index: 2;
    }

    &__closeIcon {
      position: absolute;
      top: 70px;
      left: 60px;
      width: 50px;
      height: 50px;
      cursor: pointer;
      z-index: 3;

      &::before, &::after {
        content: "";
        top: 20px;
        width: 50px;
        position: absolute;
        height: 10px;
        background-color: #ffffff;
      }

      &::before {
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(-45deg);
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      flex-basis: 50%;
      height: 50%;
      background-color: #ffffff;
      border-radius: 15px;
      justify-content: space-around;
      align-items: center;
      position: relative;
      z-index: 3;
    }

    &__title {
      font-size: 26px;
      font-weight: 600;
    }

    &__maxLengthNotify {
      position: absolute;
      color: red;
      top: 270px;
      font-size: 20px;
    }

    &__input {
      height: 30px;
      font-size: 20px;
      padding: 5px;

      &:focus {
        outline: none;
      }
    }

    &__button {
      cursor: pointer;
      width: 200px;
      height: 40px;
      border-radius: 10px;
      border: none;
      font-size: 18px;
      font-weight: 600;
      opacity: 0.8;
      transition: opacity 1s;

      &:hover {
        opacity: 0.5;
      }

      &--disabled {
        opacity: 0.3;
        pointer-events: none;
      }
    }
  }
</style>

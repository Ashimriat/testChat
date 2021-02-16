<template lang="pug">
  .ErrorNotify(v-if="error")
    | {{ errorMessage }}
</template>

<script>
  import { mapMutations, mapState} from "vuex";
  import { ERRORS_TYPES } from "../constants";
  import mutations from "../store/mutations";
  import { GENERAL_MODULE } from "../store/modulesNames";


  const { GENERAL: { SET_ERROR } } = mutations;

  let errorTimerId;

  export default {
    name: "ErrorNotify",
    methods: {
      ...mapMutations({
	setError: `${GENERAL_MODULE}/${SET_ERROR}`
      }),
    },
    computed: {
      ...mapState({
        error: state => state[GENERAL_MODULE].error
      }),
      errorMessage() {
        if (!this.error) return '';
        switch (this.error) {
          case ERRORS_TYPES.noMessagesHistory:
            return 'Не удалось загрузить историю сообщений.';
          case ERRORS_TYPES.noRoomsList:
            return 'Не удалось загрузить список комнат.';
          case ERRORS_TYPES.messageNotSent:
            return 'Не удалось отправить сообщение.';
          case ERRORS_TYPES.settingsLoadFailed:
            return 'Не удалось загрузить настройки, будут использованы значения по умолчанию.';
          case ERRORS_TYPES.noSocketConnect:
            return 'Не удалось соединиться с сокетом сервера, попробуйте позднее.';
          case ERRORS_TYPES.noSocketPong:
            return 'Сервер не пингуется, попробуйте позднее.';
          case ERRORS_TYPES.roomExists:
          	return 'Комната с таким именем уже существует.';
        }
      }
    },
    watch: {
      error(newVal) {
        if (!newVal) return;
        errorTimerId = setTimeout(() => {
	  this.setError(null);
	  clearTimeout(errorTimerId);
	}, 4000);
      }
    }
  }
</script>

<style lang="scss">
  .ErrorNotify {
    position: absolute;
    right: 20px;
    top: 100px;
    font-size: 18px;
    width: 200px;
    background-color: brown;
    color: #ffffff;
    padding: 5px;
    text-align: center;
    border-radius: 20px;
    z-index: 4;
  }
</style>

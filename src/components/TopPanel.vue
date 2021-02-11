<template lang="pug">
  .TopPanel
    .TopPanel__userInfo
      | Вы вошли как:
      |
      span
        | {{ userName }}
    button.TopPanel__logoutButton(@click="logOut")
      | Выйти
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import actions from "../store/actions";
  import { USER_MODULE } from "../store/modulesNames";


  const { USER: { LOGOUT_USER } } = actions;

  export default {
		name: "TopPanel",
    methods: {
			...mapActions({
        logOut: `${USER_MODULE}/${LOGOUT_USER}`
			})
    },
    computed: {
			...mapState({
        userName: state => state[USER_MODULE].userName
			})
    }
	}
</script>

<style lang="scss">
  .TopPanel {
    grid-area: topPanel;
    background-color: green;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5%;

    &__userInfo {
      color: #ffffff;
      font-size: 20px;

      span {
        font-weight: 600;
        color: aqua;
        font-size: 20px;
      }
    }

    &__logoutButton {
      cursor: pointer;
      width: 150px;
      height: 40px;
      border-radius: 10px;
      border: none;
      font-size: 18px;
      font-weight: 600;
      background-color: brown;
    }
  }
</style>

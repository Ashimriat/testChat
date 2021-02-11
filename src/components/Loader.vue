<template lang="pug">
  .Loader
    .Loader__circle
    .Loader__text
      | Подождите...
</template>

<script>
	export default {
		name: "Loader"
	}
</script>

<style lang="scss">
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .Loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 150px;
    height: 185px;
    z-index: 4;

    &__circle {
      width: 100px;
      height: 100px;
      border: 5px solid green;
      border-top: 0;
      border-radius: 50%;
      animation: rotate;
      animation-duration: 3s;
      animation-iteration-count: infinite;
    }

    &__text {
      font-size: 18px;
      font-weight: 600;
    }
  }
</style>

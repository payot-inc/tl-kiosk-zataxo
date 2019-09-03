<template>
  <sui-modal v-model="open" size="basic" :closable="false">
    <sui-modal-content class="ui modal qu_modal">
      <slot />
    </sui-modal-content>
  </sui-modal>
</template>

<script>
export default {
  name: 'ConfirmModal',
  data() {
    return {
      open: false,
    };
  },

  methods: {
    show(state) {
      this.open = state;
    },
  },
};
</script>

<style>
/* .ui.modal {
  position: unset;
  background: transparent;
} */
</style>
<template>
  <section class="section">
    <b-field position="is-centered">
      <b-input
        v-model="user"
        placeholder="Name..."
        type="text"
        icon="account"
      ></b-input>
      <p class="control">
        <button @click="join" class="button is-info">Join</button>
      </p>
    </b-field>
  </section>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      user: ''
    }
  },
  methods: {
    join() {
      if (this.user.length <= 0) {
        this.emptyName()
      }
      if (this.user.length > 0 && this.user.length < 2) {
        this.shortName()
      }
      if (this.user.length > 48) {
        this.longName()
      }
      if (this.user.length >= 2 && this.user.length <= 48) {
        this.goodToGo()
      }
    },
    emptyName() {
      this.$buefy.toast.open({
        duration: 3000,
        message: `Type name to join the meeting`,
        position: 'is-bottom',
        type: 'is-warning'
      })
    },
    shortName() {
      this.$buefy.toast.open({
        duration: 3000,
        message: `Too short name`,
        position: 'is-bottom',
        type: 'is-warning'
      })
    },
    longName() {
      this.$buefy.toast.open({
        duration: 3000,
        message: `Too long name`,
        position: 'is-bottom',
        type: 'is-warning'
      })
    },
    goodToGo() {
      this.$buefy.toast.open({
        duration: 3000,
        message: `Great`,
        position: 'is-bottom',
        type: 'is-info'
      })
    }
  }
}
</script>

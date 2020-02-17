https://github.com/buefy/buefy/issues/2160 
Waiting for new relase (nuxt-buefy, buefy)

Buefy fix:

.node_modules/buefy/src/components/navbar/Navbar.vue 

REPLACE

    beforeDestroy() {
        let className = ''
        if (this.fixedTop) {
            className = this.spaced
                ? BODY_SPACED_FIXED_TOP_CLASS : BODY_FIXED_TOP_CLASS
        } else if (this.fixedBottom) {
            className = this.spaced
                ? BODY_SPACED_FIXED_BOTTOM_CLASS : BODY_FIXED_BOTTOM_CLASS
        }
        this.removeBodyClass(className)
    },

WITH

    beforeDestroy() {
        if (this.fixedTop) {
            const className = this.spaced
                ? BODY_SPACED_FIXED_TOP_CLASS : BODY_FIXED_TOP_CLASS
            this.removeBodyClass(className)
        } else if (this.fixedBottom) {
            const className = this.spaced
                ? BODY_SPACED_FIXED_BOTTOM_CLASS : BODY_FIXED_BOTTOM_CLASS
            this.removeBodyClass(className)
        }
    },
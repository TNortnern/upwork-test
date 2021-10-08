<template>
  <div>
    <p v-if="title" class="font-bold text-2xl mb-3 text-center">{{ title }}</p>
    <slot name="top" />
    <div
      class="
        grid grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        gap-3
      "
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

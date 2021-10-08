<template>
  <button
    class="
      border-4
      rounded-md
      flex flex-col
      items-center
      justify-center
      font-bold
      duration-150
      gap-y-1
    "
    :class="
      isSelected
        ? 'bg-blue-600 text-white border-transparent hover:bg-opacity-75'
        : 'border-gray-500 hover:bg-gray-200'
    "
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

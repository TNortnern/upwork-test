<template>
  <input
    :id="`search ${Math.random()}`"
    :name="`search ${Math.random()}`"
    :value="modelValue"
    class="
      px-4
      py-3
      rounded-md
      border-2 border-gray-500
      w-full
      focus:ring-4 focus:ring-blue-400
      duration-150
    "
    type="text"
    autocomplete="off"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style></style>

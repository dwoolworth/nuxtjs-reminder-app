<template>
    <i :class="className"></i>
</template>

<script setup lang="ts">
interface Props {
    icon: any
}

const props = defineProps < Props > ();

const className = computed(() => {
    const icon = props.icon
    if (Array.isArray(icon)) {
        return icon.join(' ');
    }
    return icon;
});
</script>
<template>
  <time :datetime="datetime">
    {{ formatDate }}
  </time>
</template>

<script lang="ts">
import moment from 'moment'
import { defineComponent } from 'vue'

type Props = {
  value: Date
}
export default defineComponent({
  props: {
    value: {
      type: Date,
      required: true
    }
  },
  setup(props: Props) {
    return {
      datetime: moment(props.value).toString(),
      formatDate: moment(props.value).format('YYYY/MM/DD HH:mm:ss')
    }
  }
})
</script>
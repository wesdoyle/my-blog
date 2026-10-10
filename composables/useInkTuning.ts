// Live tuning values for the hidden-text layer, shared between the layer and
// the temporary tuning panel on the home page.
import { reactive, ref } from 'vue'
import { DEFAULT_INK, type InkParams } from '~/utils/inkText'

const params = reactive<InkParams>({ ...DEFAULT_INK })
const source = ref('') // title of the text the layer picked on this load

export function useInkTuning () {
  const reset = () => Object.assign(params, DEFAULT_INK)
  return { params, reset, source }
}

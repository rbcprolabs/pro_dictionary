export default function threeArray(isLink = false) {
  return this.map((origin, index, arr) => {
    let deep = isLink ? '/' : ''

    for (let i = 0; i < index + 1; i++) deep += arr[i] + '/'

    return {
      origin,
      deep: deep.slice(0, -1),
    }
  })
}

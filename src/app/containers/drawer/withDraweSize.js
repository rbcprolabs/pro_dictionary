/**
 * Set drawer size for view
 * @param {string} drawerSize
 */
export default function withDrawerSize(drawerSize = 'small') {
  return function (WrappedComponent) {
    WrappedComponent.__drawerSize__ = drawerSize
    return WrappedComponent
  }
}

export default autoMeta => ({
  onChange (change) {
    const newData = autoMeta(change)
    if (newData) {
      change.setNodeByKey(change.value.document.key, {
        data: newData
      })
    }
  }
})

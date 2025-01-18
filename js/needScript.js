function linkMax(str) {
  return (str.length > 43) ?
    str.slice(0, 43 - 1) + '…' : str;
}

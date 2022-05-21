function add0(m) { return m < 10 ? '0' + m : m }

function timestamp_format(timestamp) {
  let time = new Date(timestamp)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()

  timestamp = new Date()
  let tmp = ''
  if (y != timestamp.getFullYear()) {
    tmp += y + '-' + add0(m) + '-' + add0(d) + ' '
  } else {
    tmp += add0(m) + '-' + add0(d) + ' '
  }
  return tmp + add0(h) + ':' + add0(mm) + ':' + add0(s)
}

function AddressToName(address_map, address) {
  if (address_map[address] != null) {
    return address_map[address]
  } else {
    return address
  }
}
export {
  timestamp_format,
  AddressToName
}
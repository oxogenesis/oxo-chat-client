import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  item: {
    height: 56,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  item_title_view: {
    flex: 0.6
  },
  item_title_text: {
    fontSize: 16,
    lineHeight: 55,
  },
  item_icon_view: {
    flex: 0.4
  },
  item_switch: {
    flex: 0.4,
    lineHeight: 55
  },
  item_icon_text: {
    lineHeight: 55,
    textAlign: 'right',
  },
})

export default styles

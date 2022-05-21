import { StyleSheet } from 'react-native'

const my_styles = StyleSheet.create({
  TabSheet: {
    paddingBottom: 70
  },
  SearchBar: {
    height: 50,
    backgroundColor: 'powderblue'
  },
  Link: {
    color: 'blue',
    fontWeight: 'bold'
  },
  Bulletin: {
    borderStyle: 'solid'
  },
  BulletinContentHeader: {
    //lineHeight: 5
  },
  SeperateLine: {
    textAlign: 'center'
  },
  Avatar: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
  },
  container: {
    flex: 1,
    padding: 5,
  },
})

const light = {
  base_view: '#EDEDED',
  base_body: '#fff',
  link_color: '#002766',
  text1: '#111', //主要
  text2: '#888888', //次要
  border_color: '#DDDDE1',
  // link_color_2: '',
  green_color: '#73d13d'
}

const dark = {
  base_view: '#111',
  base_body: '#181818',
  link_color: '#002766',
  text1: '#fff',
  text2: '#888888',
  border_color: '#DDDDE1',
  green_color: '#73d13d'
}

const styles = {
  base_text_md: {
    color: light.text1,
    fontSize: 18,
    marginLeft: 24,
  },
  base_text_id: {
    fontSize: 14,
    marginLeft: 24,
    color: light.text2
  },
  base_text_lg: {
    color: light.text1,
    fontSize: 20,
    marginLeft: 12,
  },
  base_view: {
    padding: 6,
    height: '100%',
    backgroundColor: light.base_body
  },
  base_body: {
    padding: 6,
    height: '100%',
  },
  base_body1: {
    height: '100%',
    backgroundColor: light.base_body
  },
  base_body2: {
    flexDirection: "column",
    height: '100%',
    position: 'relative',
  },
  base_color: {
    backgroundColor: light.base_body
  },
  base_view_r: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  base_view_a: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 99,
  },
  scroll_view: {
    marginBottom: 60
  },
  btn_high: {
    height: 55,
  },
  input_view: {
    height: 55,
    padding: 12,
    borderRadius: 6,
    borderColor: light.border_color,
    borderWidth: 1
  },
  required_text: {
    color: 'red'
  },
  link_text: {
    color: light.text2
  },
  linfo_big: {
    fontSize: 32,
    color: light.text2,
    textAlign: 'center',
    marginTop: 72,
  },
  divider: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 200,
    height: 1,
    backgroundColor: light.border_color
  },
  avatar_list: {
    marginBottom: 1,
    padding: 12,
  },
  img_md: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  msg_img: {
    width: 55,
    height: 55,
    borderRadius: 6,
  },
  name: {
    color: light.link_color,
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 24,
  },
  name1: {
    color: light.link_color,
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 18,
  },
  name2: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  text1: {
    fontSize: 16,
    color: light.text1
  },
  text2: {
    fontSize: 16,
    color: light.text2
  },
  address: {
    fontSize: 12,
    marginLeft: 24,
    color: light.text2
  },
  content_view: {
    paddingRight: 50,
    flex: 1,
    flexDirection: "row",
  },
  content_text: {
    fontSize: 16,
    width: '100%'
  },
  link_text: {
    color: light.link_color
  },
  desc_view: {
    marginTop: 5,
    color: light.text2,
    flex: 1
  },
  btns: {
    flex: 0.4,
    padding: 2,
    textAlign: 'right',
  },
  link_list: {
    backgroundColor: light.base_body,
    padding: 3,
  },
  link_list_text: {
    fontSize: 16,
    lineHeight: 50,
    height: 50,
    borderTopWidth: 1
  },
  list_border: {
    borderBottomWidth: 1,
    width: '100%',
    padding: 12,
  },
  border1: {
    borderBottomWidth: 1,
  },
  format_text1: {
    color: light.text2,
    flex: 0.6
  },
  format_text2: {
    flex: 0.4,
    padding: 2,
    textAlign: 'right',
    color: light.text2
  },
  quote_list_text: {
    height: 50,
    lineHeight: 50,
    paddingLeft: 24,
    paddingRight: 24,
    fontSize: 20,
  },
  cancel_text: {
    textAlign: 'right',
    color: light.link_color
  },
  view1: {
    maxWidth: '70%',
    marginLeft: 12
  },
  mess_content: {
    backgroundColor: light.base_body,
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
    // borderBottomLeftRadius: 10,
    // borderBottomLeftRadius: 10,
  },
  my_mess: {
    backgroundColor: light.green_color
  },
  text3: {
    fontSize: 20,
    color: light.text2
  },
  text4: {
    color: light.link_color,
    fontWeight: 'bold'
  },
  text5: {
    color: light.text2,
  },
  view5: {
    textAlign: 'right',
    fontSize: 16,
    color: light.text1,
    marginRight: 12,
  },
  send_view: {
    width: '100%',
    flexDirection: "row-reverse",
    position: 'absolute',
    bottom: 0,
  },
  form_view: {
    flex: 0.4,
    padding: 2,
    textAlign: 'right',
    color: light.text2
  },
  base_icon: {

  },
  list_small: {

  },
  date_text: {
    color: light.text2,
  },
  unread: {
    color: light.green_color,
    marginRight: 12,
  },
  read: {
    color: light.text2,
    marginRight: 12,
  },
  icon_view: {
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 3,
    paddingBottom: 3,
    textAlign: 'center'
  },
  icon_text: {
    lineHeight: 32,
    color: '#fff',
    textAlign: 'center'
  }

}

export { my_styles, styles }
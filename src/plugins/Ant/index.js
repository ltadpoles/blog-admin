import {
    Menu,
    Button,
    Input,
    Form,
    Select,
    Radio,
    DatePicker,
    Checkbox,
    Layout,
    Breadcrumb,
    Avatar,
    Badge,
    Dropdown,
    Tabs
} from 'ant-design-vue'

const ant = {
    install(Vue) {
        Vue.component(Layout.name, Layout)
        Vue.component(Layout.Sider.name, Layout.Sider)
        Vue.component(Layout.Header.name, Layout.Header)
        Vue.component(Layout.Content.name, Layout.Content)
        Vue.component(Layout.Footer.name, Layout.Footer)
        Vue.component(Avatar.name, Avatar)
        Vue.component(Badge.name, Badge)
        Vue.component(Dropdown.name, Dropdown)
        Vue.component(Breadcrumb.name, Breadcrumb)
        Vue.component(Breadcrumb.Item.name, Breadcrumb.Item)
        Vue.component(Menu.name, Menu)
        Vue.component(Menu.Item.name, Menu.Item)
        Vue.component(Menu.SubMenu.name, Menu.SubMenu)
        Vue.component(Button.name, Button)
        Vue.component(Input.name, Input)
        Vue.component(Form.name, Form)
        Vue.component(Form.Item.name, Form.Item)
        Vue.component(Tabs.name, Tabs)
        Vue.component(Tabs.TabPane.name, Tabs.TabPane)
        Vue.component(Select.name, Select)
        Vue.component(Radio.name, Radio)
        Vue.component(Checkbox.name, Checkbox)
        Vue.component(DatePicker.name, DatePicker)
    }
}
export default ant

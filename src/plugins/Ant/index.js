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
    Tabs,
    Space,
    Table,
    Tag,
    Divider,
    Popover,
    Upload,
    Popconfirm,
    Modal,
    Switch
} from 'ant-design-vue'

const ant = {
    install(Vue) {
        Vue.use(Select)
        Vue.component(Layout.name, Layout)
        Vue.component(Layout.Sider.name, Layout.Sider)
        Vue.component(Layout.Header.name, Layout.Header)
        Vue.component(Layout.Content.name, Layout.Content)
        Vue.component(Layout.Footer.name, Layout.Footer)
        Vue.component(Avatar.name, Avatar)
        Vue.component(Space.name, Space)
        Vue.component(Badge.name, Badge)
        Vue.component(Dropdown.name, Dropdown)
        Vue.component(Breadcrumb.name, Breadcrumb)
        Vue.component(Breadcrumb.Item.name, Breadcrumb.Item)
        Vue.component(Menu.name, Menu)
        Vue.component(Menu.Item.name, Menu.Item)
        Vue.component(Menu.SubMenu.name, Menu.SubMenu)
        Vue.component(Button.name, Button)
        Vue.component(Input.name, Input)
        Vue.component(Input.Password.name, Input.Password)
        Vue.component(Input.TextArea.name, Input.TextArea)
        Vue.component(Form.name, Form)
        Vue.component(Form.Item.name, Form.Item)
        Vue.component(Switch.name, Switch)
        Vue.component(Table.name, Table)
        Vue.component(Divider.name, Divider)
        Vue.component(Tabs.name, Tabs)
        Vue.component(Tabs.TabPane.name, Tabs.TabPane)
        Vue.component(Tag.name, Tag)
        Vue.component(Popover.name, Popover)
        Vue.component(Popconfirm.name, Popconfirm)
        Vue.component(Modal.name, Modal)
        Vue.component(Radio.name, Radio)
        Vue.component(Radio.Group.name, Radio.Group)
        Vue.component(Upload.name, Upload)
        Vue.component(Checkbox.name, Checkbox)
        Vue.component(DatePicker.name, DatePicker)
        Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker)
    }
}
export default ant

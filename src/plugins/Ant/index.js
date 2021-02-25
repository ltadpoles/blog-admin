import {
    Menu,
    Button,
    Input,
    Steps,
    Form,
    Select,
    Row,
    Radio,
    DatePicker,
    Col,
    Icon,
    Checkbox,
    Switch,
    Layout,
    Breadcrumb
} from 'ant-design-vue'

const ant = {
    install(Vue) {
        Vue.component(Layout.name, Layout)
        Vue.component(Layout.Sider.name, Layout.Sider)
        Vue.component(Layout.Header.name, Layout.Header)
        Vue.component(Layout.Content.name, Layout.Content)
        Vue.component(Layout.Footer.name, Layout.Footer)
        Vue.component(Breadcrumb.name, Breadcrumb)
        Vue.component(Breadcrumb.Item.name, Breadcrumb.Item)
        Vue.component(Menu.name, Menu)
        Vue.component(Menu.Item.name, Menu.Item)
        Vue.component(Menu.SubMenu.name, Menu.SubMenu)
        Vue.component(Button.name, Button)
        Vue.component(Input.name, Input)
        Vue.component(Steps.name, Steps)
        Vue.component(Form.name, Form)
        Vue.component(Select.name, Select)
        Vue.component(Row.name, Row)
        Vue.component(Radio.name, Radio)
        Vue.component(DatePicker.name, DatePicker)
        Vue.component(Col.name, Col)
        Vue.component(Icon.name, Icon)
        Vue.component(Checkbox.name, Checkbox)
        Vue.component(Switch.name, Switch)
    }
}
export default ant

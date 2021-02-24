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
    Switch
} from 'ant-design-vue'

const ant = {
    install(Vue) {
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

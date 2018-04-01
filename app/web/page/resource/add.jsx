import React, { Component } from 'react';
import HomeLayout from 'component/homelayout/homelayout.jsx';
import './add.css';
import 'draft-js/dist/Draft.css';
import { SketchPicker } from 'react-color';
import {
    Form,
    Input,
    Tooltip,
    Upload,
    Icon,
    Cascader,
    Select,
    Modal,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,
    Breadcrumb,
    Radio
} from 'antd';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { max } from 'moment';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioButton = Radio.Button;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const RadioGroup = Radio.Group;
let styleMap = {
    COLOR: {
        color: '#ff0000'
    }
};
const categorys = [
    {
        value: 'art',
        label: 'Art'
    },
    {
        value: 'space',
        label: 'Space'
    },
    {
        value: 'landscape',
        label: 'Landscape'
    }
];

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = file => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
};

let ResourceAdd = undefined;

class ResourceCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            canRenderEditor: false,
            autoCompleteResult: [],
            loading: false,
            editorState: EditorState.createEmpty(),
            visibleColorModal: false,
            currentColor: '#595959'
        };
        this.handleSubmit = e => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                }
            });
        };
        this.handleConfirmBlur = e => {
            const value = e.target.value;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
        };
        this.compareToFirstPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('password')) {
                callback('Two passwords that you enter is inconsistent!');
            } else {
                callback();
            }
        };
        this.validateToNextPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.confirmDirty) {
                form.validateFields(['confirm'], { force: true });
            }
            callback();
        };
        this.handleWebsiteChange = value => {
            let autoCompleteResult;
            if (!value) {
                autoCompleteResult = [];
            } else {
                autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
            }
            this.setState({ autoCompleteResult });
        };
        this.normFile = e => {
            console.log('Upload event:', e);
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        };
        this.handleChange = info => {
            if (info.file.status === 'uploading') {
                this.setState({ loading: true });
                return;
            }
            if (info.file.status === 'done') {
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, imageUrl =>
                    this.setState({
                        imageUrl,
                        loading: false
                    })
                );
            }
        };
        this.onChange = editorState => this.setState({ editorState });
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
        this.handleOkColorModal = () => {};
        this.handleCancelColorModal = () => {
            this.setState({
                visibleColorModal: false
            });
        };
        this.showColoMoadl = r => {
            this.setState({
                visibleColorModal: true
            });
        };
        this.changeColor = (color, event) => {
            styleMap.COLOR.color = color.hex;
            this.toggleInlineStyle('COLOR');
            this.setState({ currentColor: color.hex });
        };
    }

    componentDidMount() {
        this.setState({ canRenderEditor: true });
    }

    componentWillUnmount() {
        this.setState({ canRenderEditor: false });
    }

    toggleInlineStyle(inlineStyle) {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86'
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );

        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text" />
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const checkIfIsImage = () => {
            const form = this.props.form;
            if (form.getFieldValue('resource-type') === 'image') return false;
            else return true;
        };
        return (
            <HomeLayout>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label={
                            <span>
                                Resource Name&nbsp;
                                <Tooltip title="What do you want others to call it?">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        }
                    >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input the name!', whitespace: true }]
                        })(<Input />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="Category">
                        {getFieldDecorator('category', {
                            initialValue: ['art'],
                            rules: [{ type: 'array', required: true, message: 'Please select the category!' }]
                        })(<Cascader options={categorys} />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="Tags">
                        {getFieldDecorator('tags', {
                            rules: [{ required: true, message: 'Please select tags for the resource!', type: 'array' }]
                        })(
                            <Select mode="multiple" placeholder="Please select tags">
                                <Option value="beautiful">Beautiful</Option>
                                <Option value="fantastic">Fantastic</Option>
                                <Option value="tricky">Tricky</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={<span>Brief Introduction</span>}>
                        {getFieldDecorator('content', {
                            rules: [{ required: true, message: 'Please input the content!', whitespace: true }]
                        })(<TextArea autosize={true} row={20} />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="Preview Image">
                        <div className="dropbox">
                            {getFieldDecorator('dragger', {
                                rules: [{ required: true, message: 'Please select a file!' }],
                                valuePropName: 'fileList',
                                getValueFromEvent: this.normFile
                            })(
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    beforeUpload={beforeUpload}
                                    onChange={this.handleChange}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
                                </Upload>
                            )}
                        </div>
                    </FormItem>
                    {this.state.canRenderEditor ? (
                        <FormItem {...formItemLayout} label="Content">
                            <Breadcrumb separator="|">
                                <Breadcrumb.Item>
                                    <Tooltip title="Bold">
                                        <Button
                                            id="editor-btn"
                                            size="small"
                                            onClick={() => {
                                                this.toggleInlineStyle('BOLD');
                                            }}
                                        >
                                            <i className="icon iconfont anticon">&#xe653;</i>
                                        </Button>
                                    </Tooltip>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Tooltip title="Italic">
                                        <Button
                                            id="editor-btn"
                                            size="small"
                                            onClick={() => {
                                                this.toggleInlineStyle('ITALIC');
                                            }}
                                        >
                                            <i className="icon iconfont anticon">&#xeb31;</i>
                                        </Button>
                                    </Tooltip>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Tooltip title="Underline">
                                        <Button
                                            id="editor-btn"
                                            size="small"
                                            onClick={() => {
                                                this.toggleInlineStyle('UNDERLINE');
                                            }}
                                        >
                                            <i className="icon iconfont anticon">&#xe823;</i>
                                        </Button>
                                    </Tooltip>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Tooltip title="Font Color">
                                        <Button
                                            id="editor-btn"
                                            size="small"
                                            onClick={() => {
                                                this.showColoMoadl();
                                            }}
                                        >
                                            <i
                                                style={{ color: this.state.currentColor }}
                                                className="icon iconfont anticon"
                                            >
                                                &#xeae6;
                                            </i>
                                        </Button>
                                    </Tooltip>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <Editor
                                editorState={this.state.editorState}
                                onChange={this.onChange}
                                customStyleMap={styleMap}
                            />
                        </FormItem>
                    ) : null}
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </FormItem>
                </Form>
                <div>
                    <Modal
                        visible={this.state.visibleColorModal}
                        onOk={this.handleOkColorModal}
                        onCancel={this.handleCancelColorModal}
                        width={265}
                        closable={false}
                        footer={null}
                        cancelText="Cancel"
                        okText="OK"
                    >
                        <SketchPicker color={this.state.currentColor} onChange={this.changeColor} />
                    </Modal>
                </div>
            </HomeLayout>
        );
    }
}

export default (ResourceAdd = Form.create()(ResourceCreateForm));

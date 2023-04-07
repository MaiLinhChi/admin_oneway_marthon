import { Form, Input, Button, Space } from "antd"
import HTTP from "src/controller/API/HTTP";
const ChangePasswordModal = ({closeModal}) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      await HTTP.changePassword("password", values);
      alert("Change password success");
      closeModal();
      form.resetFields();
    } catch (error) {
      alert(error.message)
    }
  };
  return (
    <Form onFinish={onFinish} autoComplete="off" form={form}>
      <Form.Item name="oldPassword" label="Old Password" rules={[{ required: true }]}>
        <Input type="password" />
      </Form.Item>
      <Form.Item name="newPassword" label="New Password" rules={[{ required: true }]}>
        <Input type="password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Change Password
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ChangePasswordModal
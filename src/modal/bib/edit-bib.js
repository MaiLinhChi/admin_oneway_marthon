import { Form, Input, Button, Space, Select } from "antd"
import { useState } from "react";
import Loading from "src/components/Loading";
import HTTP from "src/controller/API/HTTP";

const EditBibModal = ({ getData, closeModal }) => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const { Option } = Select;
  const onFinish = async (values) => {
    setLoading(true)
    try {
      await HTTP.addBib("bib", values);
      alert("Add bib success");
      closeModal();
      form.resetFields();
      getData();
    } catch (error) {
      alert(error.message)
    }
    setLoading(false)
  };
  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="marathon" label="Marathon" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select your favourite colors!' }]}
      >
        <Select>
          <Option value="pay">Pay</Option>
          <Option value="unpay">Unpay</Option>
        </Select>
      </Form.Item>
      <Form.Item name="price" label="Price" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Bib
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditBibModal
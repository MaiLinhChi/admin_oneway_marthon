import { Form, Input, Button, Space } from "antd"
import { useState } from "react";
import Loading from "src/components/Loading";
import HTTP from "src/controller/API/HTTP";

const AddMarathonModal = ({getData, closeModal}) => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    setLoading(true)
    try {
      await HTTP.addMarathon("marathons", values);
      alert("Add marathons success")
      form.resetFields();
      getData();
      closeModal();
    } catch (error) {
      alert(error.message)
    }
    setLoading(false)
  };
  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="description" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="startTime" label="startTime" rules={[{ required: true }]}>
        <Input type="date" />
      </Form.Item>
      <Form.Item name="image" label="image" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="location" label="location" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="type" label="type" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Race">
      <Form.List name="race">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map(field => (
                <>
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                    <Form.Item
                      {...field}
                      name={[field.name, 'routeMap']}
                      fieldKey={[field.fieldKey, 'routeMap']}
                      rules={[{ required: true, message: 'routeMap' }]}
                    >
                      <Input placeholder="routeMap" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'distance']}
                      fieldKey={[field.fieldKey, 'distance']}
                      rules={[{ required: true, message: 'distance' }]}
                    >
                      <Input placeholder="distance" type="number" />
                    </Form.Item>
                    <Form.Item label="award">
                    <Input.Group compact>
                      <Form.Item
                        name={[field.name, 'award', 'male']}
                        noStyle
                        rules={[{required: true, message: 'award male is required' }]}
                      >
                        <Input style={{ width: '50%' }} placeholder="award male" type="number" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'award', 'female']}
                        noStyle
                        rules={[{ required: true, message: 'award female is required' }]}
                      >
                        <Input style={{ width: '50%' }} placeholder="award female" type="number" />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                    <Button
                      onClick={() => {
                        remove(field.name);
                      }}
                      danger
                    >Remove</Button>
                  </Space>
                  <Form.Item label="Price">
                    <Form.List name={[field.name, 'price']}>
                          {(nicknames, { add, remove }) => {
                            return (
                              <div>
                                {nicknames.map(nickname => (
                                  <Space key={nickname.key} align="start">
                                    <Form.Item
                                      {...nickname}
                                      name={[nickname.name, 'name']}
                                      fieldKey={[nickname.fieldKey, 'name']}
                                      rules={[{ required: true, message: 'Missing name' }]}
                                    >
                                      <Input placeholder="name" />
                                    </Form.Item>
                                    <Form.Item
                                      {...nickname}
                                      name={[nickname.name, 'startSell']}
                                      fieldKey={[nickname.fieldKey, 'startSell']}
                                      rules={[{ required: true, message: 'Missing start sell' }]}
                                    >
                                      <Input placeholder="startSell" type="date" />
                                    </Form.Item>
                                    <Form.Item
                                      {...nickname}
                                      name={[nickname.name, 'individual']}
                                      fieldKey={[nickname.fieldKey, 'individual']}
                                      rules={[{ required: true, message: 'Missing individual' }]}
                                    >
                                      <Input placeholder="individual" type="number" />
                                    </Form.Item>
                                    <Form.Item
                                      {...nickname}
                                      name={[nickname.name, 'group']}
                                      fieldKey={[nickname.fieldKey, 'group']}
                                      rules={[{ required: true, message: 'Missing group' }]}
                                    >
                                      <Input placeholder="group" type="number" />
                                    </Form.Item>
                                    <Button
                                      onClick={() => {
                                        remove(nickname.name);
                                      }}
                                      danger
                                    >
                                      Remove
                                    </Button>
                                  </Space>
                                ))}

                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => {
                                      add();
                                    }}
                                    block
                                  >
                                    Add price
                                  </Button>
                                </Form.Item>
                              </div>
                            );
                          }}
                    </Form.List>
                  </Form.Item>
                </>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                >
                   Add Race
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Marathon
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddMarathonModal
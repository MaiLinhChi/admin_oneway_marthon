import { Form, Input, Button, Space, Select } from "antd"
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import Loading from "src/components/Loading";
import HTTP from "src/controller/API/HTTP";
import TextEditor from "src/components/TextEditor";

const EditMarathonModal = ({data, getData, closeModal}) => {
  const { Option } = Select;
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    setLoading(true)
    try {
      await HTTP.editMarathon("marathons/" + data._id, values);
      alert("Edit marathons success")
      form.resetFields();
      getData();
      closeModal();
    } catch (error) {
      alert(error.message)
    }
    setLoading(false)
  };
  useEffect(() => {
    form.setFieldsValue({
      name: data.name,
      description: data.description,
      startTime: data.startTime,
      image: data.image,
      location: data.location,
      status: data.status,
      type: data.type,
      race: data.race,
      registerGroup: data.registerGroup,
      raceKit: data.raceKit,
      service: data.service,
      schedule: data.schedule,
      regulation: data.regulation
    });
  })
  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" form={form}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]} labelCol={{span: 24}}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]} labelCol={{span: 24}}>
        <TextArea placeholder="Route map" allowClear />
      </Form.Item>
      <Form.Item name="startTime" label="Start time" rules={[{ required: true }]} labelCol={{span: 24}}>
        <Input type="date" />
      </Form.Item>
      <Form.Item name="image" label="Image" rules={[{ required: true }]} labelCol={{span: 24}}>
        <Input />
      </Form.Item>
      <Form.Item name="location" label="Location" rules={[{ required: true }]} labelCol={{span: 24}}>
        <Input />
      </Form.Item>
      <Form.Item name="type" label="Type" rules={[{ required: true }]} labelCol={{span: 24}}>
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select your favourite colors!' }]}
        labelCol={{span: 24}}
      >
        <Select>
          <Option value="active">Active</Option>
          <Option value="deactive">Deactive</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Race">
        <Form.List name="race">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map(field => (
                  <>
                    <div key={field.key} align="start" >
                      <Form.Item
                        {...field}
                        name={[field.name, 'routeMap']}
                        fieldKey={[field.fieldKey, 'routeMap']}
                        rules={[{ required: true, message: 'routeMap' }]}
                        labelCol={{span: 24}}
                        label="Route map"
                      >
                        <TextEditor />
                      </Form.Item>
                      <Space align="start">
                        <Form.Item
                          {...field}
                          name={[field.name, 'image']}
                          fieldKey={[field.fieldKey, 'image']}
                          rules={[{ required: true, message: 'image' }]}
                          label="Image"
                          labelCol={{span: 24}}
                        >
                          <Input placeholder="image" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'distance']}
                          fieldKey={[field.fieldKey, 'distance']}
                          rules={[{ required: true, message: 'distance' }]}
                          label="Distance"
                          labelCol={{span: 24}}
                        >
                          <Input placeholder="distance" type="number" />
                        </Form.Item>
                        <Form.Item label="award" labelCol={{span: 24}}>
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
                      </Space>
                      <Form.Item className="text-center">
                        <Button onClick={() => {remove(field.name)}} danger>Remove</Button>
                      </Form.Item>
                    </div>
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
                                        labelCol={{span: 24}}
                                        label="Name"
                                      >
                                        <Input placeholder="name" />
                                      </Form.Item>
                                      <Form.Item
                                        {...nickname}
                                        name={[nickname.name, 'startSell']}
                                        fieldKey={[nickname.fieldKey, 'startSell']}
                                        rules={[{ required: true, message: 'Missing start sell' }]}
                                        labelCol={{span: 24}}
                                        label="End sell"
                                      >
                                        <Input placeholder="startSell" type="date" />
                                      </Form.Item>
                                      <Form.Item
                                        {...nickname}
                                        name={[nickname.name, 'individual']}
                                        fieldKey={[nickname.fieldKey, 'individual']}
                                        rules={[{ required: true, message: 'Missing individual' }]}
                                        labelCol={{span: 24}}
                                        label="Individual"
                                      >
                                        <Input placeholder="individual" type="number" />
                                      </Form.Item>
                                      <Form.Item
                                        {...nickname}
                                        name={[nickname.name, 'group']}
                                        fieldKey={[nickname.fieldKey, 'group']}
                                        rules={[{ required: true, message: 'Missing group' }]}
                                        labelCol={{span: 24}}
                                        label="Group"
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
      <Form.Item label="Register group">
        <Form.List name="registerGroup">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map(field => (
                  <>
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                      <Form.Item label="numberPerson">
                        <Input.Group compact>
                          <Form.Item
                            name={[field.name, 'numberPerson', 'from']}
                            noStyle
                            rules={[{required: true, message: 'from is required' }]}
                            label="From"
                            labelCol={{span: 24}}
                          >
                            <Input style={{ width: '50%' }} placeholder="from" type="number" />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'numberPerson', 'to']}
                            noStyle
                            rules={[{ required: true, message: 'to is required' }]}
                            label="To"
                            labelCol={{span: 24}}
                          >
                            <Input style={{ width: '50%' }} placeholder="to" type="number" />
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'percent']}
                        fieldKey={[field.fieldKey, 'percent']}
                        rules={[{ required: true, message: 'percent' }]}
                      >
                        <Input placeholder="percent" />
                      </Form.Item>
                      <Button
                        onClick={() => {
                          remove(field.name);
                        }}
                        danger
                      >Remove</Button>
                    </Space>
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
                    Add register group
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </Form.Item>
      <Form.Item label="Racekit" labelCol={{span: 24}}>
        <Form.List name="raceKit">
          {(fields, { add, remove }) => {
            return (
              <div style={{ display: "flex", flexWrap: 'wrap' }}>
                {fields.map(field => (
                  <>
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8, width: '320px' }} align="start">
                      <Form.Item
                        {...field}
                        name={[field.name, 'image']}
                        fieldKey={[field.fieldKey, 'image']}
                        rules={[{ required: true, message: 'image' }]}
                      >
                        <Input placeholder="image" />
                      </Form.Item>
                      <Button
                        onClick={() => {
                          remove(field.name);
                        }}
                        danger
                      >Remove</Button>
                    </Space>
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
                    Add race kit
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </Form.Item>
      <Form.Item label="Service" labelCol={{span: 24}}>
        <Input.Group compact>
          <Form.Item
            name={['service', 'image']}
            noStyle
            rules={[{required: true, message: 'image is required' }]}
          >
            <Input style={{ width: '50%' }} placeholder="image" />
          </Form.Item>
          <Form.Item
            name={['service', 'description']}
            noStyle
            rules={[{ required: true, message: 'description is required' }]}
          >
            <Input style={{ width: '50%' }} placeholder="description" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label="Schedule" labelCol={{span: 24}}>
        <Form.List name="schedule">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map(field => (
                  <>
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                      <Form.Item
                        {...field}
                        name={[field.name, 'title']}
                        fieldKey={[field.fieldKey, 'title']}
                        rules={[{ required: true, message: 'title' }]}
                      >
                        <Input placeholder="title" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'description']}
                        fieldKey={[field.fieldKey, 'description']}
                        rules={[{ required: true, message: 'description' }]}
                      >
                        <Input placeholder="description" />
                      </Form.Item>
                      <Button
                        onClick={() => {
                          remove(field.name);
                        }}
                        danger
                      >Remove</Button>
                    </Space>
                    <Form.Item label="detail">
                      <Form.List name={[field.name, 'detail']}>
                            {(nicknames, { add, remove }) => {
                              return (
                                <div>
                                  {nicknames.map(nickname => (
                                    <Space key={nickname.key} align="start">
                                      <Form.Item
                                        {...nickname}
                                        name={[nickname.name, 'time']}
                                        fieldKey={[nickname.fieldKey, 'time']}
                                        rules={[{ required: true, message: 'Missing time' }]}
                                      >
                                        <Input placeholder="time" />
                                      </Form.Item>
                                      <Form.Item
                                        {...nickname}
                                        name={[nickname.name, 'description']}
                                        fieldKey={[nickname.fieldKey, 'description']}
                                        rules={[{ required: true, message: 'Missing description' }]}
                                      >
                                        <Input placeholder="description" />
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
                                      Add detail
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
                    Add schedule
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </Form.Item>
      <Form.Item label="Regulation">
        <Form.List name="regulation">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map(field => (
                  <>
                    <div key={field.key} align="start" style={{width: '100%'}}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'title']}
                        fieldKey={[field.fieldKey, 'title']}
                        rules={[{ required: true, message: 'title' }]}
                      >
                        <Input placeholder="title" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'description']}
                        fieldKey={[field.fieldKey, 'description']}
                        rules={[{ required: true, message: 'description' }]}
                      >
                        <TextEditor />
                      </Form.Item>
                      <Form.Item className="text-center">
                        <Button
                          onClick={() => {
                            remove(field.name);
                          }}danger >Remove</Button>
                      </Form.Item>
                    </div>
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
                    Add regulation
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Edit Marathon
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditMarathonModal
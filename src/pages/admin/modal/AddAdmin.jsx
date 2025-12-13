import React from 'react';
import { Modal, Form } from 'antd';
import CustomButton from '../../../components/shared/Button';
import CustomInput from '../../../components/shared/Input';

const AddAdmin = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        form.resetFields();
        onAdd(values); // Call onAdd with the form values
        onCancel();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Add New Admin"
      open={visible}
      onCancel={onCancel}
      footer={[
        <CustomButton key="submit" type="primary" onClick={handleOk}>
          Submit
        </CustomButton>,
      ]}
    >
      <Form form={form} layout="vertical" name="add_admin_form">
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please input the first name!' }]}
        >
          <CustomInput placeholder="First Name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please input the last name!' }]}
        >
          <CustomInput placeholder="Last Name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input the email!' }]}
        >
          <CustomInput type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please input the phone number!' }]}
        >
          <CustomInput placeholder="Phone Number" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input the password!' }]}
        >
          <CustomInput type="password" placeholder="Password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAdmin;

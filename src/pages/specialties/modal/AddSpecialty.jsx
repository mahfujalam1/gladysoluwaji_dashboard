import React, { useState, useEffect } from 'react';
import { Modal, Form, Switch, Upload } from 'antd';
import { LuUpload } from 'react-icons/lu';
import CustomButton from '../../../components/shared/Button';
import CustomInput from '../../../components/shared/Input';

const AddSpecialty = ({ visible, onCancel, onAdd, loading, initialData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          name: initialData.name,
          status: initialData.isActive,
        });
        if (initialData.image && !initialData.image.includes('default-avatar.svg') && !initialData.image.includes('placehold.net')) {
          setFileList([
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: initialData.image,
            },
          ]);
        } else {
          setFileList([]);
        }
      } else {
        form.resetFields();
        setFileList([]);
      }
    }
  }, [visible, initialData, form]);

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        // Only attach image if a new file is uploaded
        const imageFile = fileList[0]?.originFileObj;
        onAdd({ ...values, image: imageFile });
      })
      .catch(() => {});
  };

  const handleUploadChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <Modal
      title={initialData ? "Edit Specialty" : "Add New Specialty"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CustomButton key="submit" type="primary" onClick={handleOk} loading={loading}>
          Submit
        </CustomButton>,
      ]}
    >
      <Form form={form} layout="vertical" name="add_specialty_form" initialValues={{ status: true }}>
        <Form.Item
          name="name"
          label="Specialty Name"
          rules={[{ required: true, message: 'Please input the specialty name!' }]}
        >
          <CustomInput placeholder="Specialty Name" />
        </Form.Item>

        <Form.Item
          label="Specialty Image"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
          >
            {fileList.length >= 1 ? null : (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <LuUpload size={24} />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status (Active/Inactive)"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSpecialty;

// import React from 'react';
// import { Form, Input, InputNumber, Button, Card, Row, Col } from 'antd';
// import { calculateBalance } from '../../utils/helpers';

// const DailyEntryForm = ({ onSubmit }) => {
//   const [form] = Form.useForm();
//   const [target, setTarget] = useState(0);
//   const [achieved, setAchieved] = useState(0);

//   const handleValuesChange = (changedValues, allValues) => {
//     if (changedValues.assignedTarget !== undefined) {
//       setTarget(changedValues.assignedTarget);
//     }
//     if (changedValues.achievedOrders !== undefined) {
//       setAchieved(changedValues.achievedOrders);
//     }
    
//     if (allValues.assignedTarget && allValues.achievedOrders) {
//       const balance = calculateBalance(allValues.assignedTarget, allValues.achievedOrders);
//       form.setFieldsValue({ balanceToAchieve: balance });
//     }
//   };

//   const handleSubmit = (values) => {
//     onSubmit({
//       ...values,
//       date: new Date().toISOString().split('T')[0]
//     });
//     form.resetFields();
//     setTarget(0);
//     setAchieved(0);
//   };

//   return (
//     <Card title="Daily Entry Form" bordered={false}>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         onValuesChange={handleValuesChange}
//       >
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               label="Assigned Target"
//               name="assignedTarget"
//               rules={[{ required: true, message: 'Please enter target' }]}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: '100%' }}
//                 placeholder="Enter target number"
//               />
//             </Form.Item>
//           </Col>
          
//           <Col span={12}>
//             <Form.Item
//               label="Achieved Orders / Conversions"
//               name="achievedOrders"
//               rules={[{ required: true, message: 'Please enter achieved orders' }]}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: '100%' }}
//                 placeholder="Enter achieved orders"
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               label="Balance to Achieve"
//               name="balanceToAchieve"
//             >
//               <InputNumber
//                 disabled
//                 value={calculateBalance(target, achieved)}
//                 style={{ width: '100%' }}
//               />
//             </Form.Item>
//           </Col>
          
//           <Col span={12}>
//             <Form.Item
//               label="Number of Shops Visited"
//               name="shopsVisited"
//               rules={[{ required: true, message: 'Please enter shops visited' }]}
//             >
//               <InputNumber
//                 min={0}
//                 style={{ width: '100%' }}
//                 placeholder="Enter number of shops"
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={24}>
//             <Form.Item
//               label="Location"
//               name="location"
//               rules={[{ required: true, message: 'Please enter location' }]}
//             >
//               <Input placeholder="Enter location/area visited" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Submit Daily Entry
//           </Button>
//         </Form.Item>
//       </Form>
//     </Card>
//   );
// };

// export default DailyEntryForm;

import React, { useState } from 'react';

const DailyEntryForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    assignedTarget: '',
    achievedOrders: '',
    shopsVisited: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBalance = () => {
    const target = parseInt(formData.assignedTarget) || 0;
    const achieved = parseInt(formData.achievedOrders) || 0;
    return Math.max(0, target - achieved);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      balanceToAchieve: calculateBalance(),
      date: new Date().toLocaleDateString()
    };
    onSubmit(data);
    setFormData({
      assignedTarget: '',
      achievedOrders: '',
      shopsVisited: '',
      location: ''
    });
    alert('Daily entry submitted successfully!');
  };

  return (
    <div className="card">
      <h2 className="card-title">Daily Entry Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-col">
            <label className="input-label">Assigned Target</label>
            <input
              type="number"
              name="assignedTarget"
              value={formData.assignedTarget}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter target number"
              required
              min="0"
            />
          </div>
          
          <div className="form-col">
            <label className="input-label">Achieved Orders / Conversions</label>
            <input
              type="number"
              name="achievedOrders"
              value={formData.achievedOrders}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter achieved orders"
              required
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label className="input-label">Balance to Achieve</label>
            <input
              type="number"
              value={calculateBalance()}
              className="input-field"
              readOnly
              style={{ backgroundColor: '#f8f9fa' }}
            />
          </div>
          
          <div className="form-col">
            <label className="input-label">Number of Shops Visited</label>
            <input
              type="number"
              name="shopsVisited"
              value={formData.shopsVisited}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter number of shops"
              required
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label className="input-label">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Location</option>
              <option value="North Delhi">North Delhi</option>
              <option value="South Delhi">South Delhi</option>
              <option value="East Delhi">East Delhi</option>
              <option value="West Delhi">West Delhi</option>
              <option value="Central Delhi">Central Delhi</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Noida">Noida</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-block mt-20">
          Submit Daily Entry
        </button>
      </form>
    </div>
  );
};

export default DailyEntryForm;
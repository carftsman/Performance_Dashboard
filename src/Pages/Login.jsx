// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { LockOutlined, UserOutlined } from '@ant-design/icons';
// // import { Button, Form, Input, Card, Typography, Alert } from 'antd';
// // import './Login.css';

// // const { Title } = Typography;

// // const Login = () => {
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const { login } = useAuth();
// //   const navigate = useNavigate();

// //   const onFinish = async (values) => {
// //     setLoading(true);
// //     setError('');
    
// //     const result = await login(values.email, values.password);
    
// //     if (result.success) {
// //       // Redirect based on role
// //       const role = JSON.parse(localStorage.getItem('user')).role;
// //       navigate(`/${role}`);
// //     } else {
// //       setError(result.message || 'Login failed');
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <div className="login-container">
// //       <Card className="login-card">
// //         <div className="login-header">
// //           <Title level={2}>Field Tracking System</Title>
// //           <p>Please login to continue</p>
// //         </div>
        
// //         {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />}
        
// //         <Form
// //           name="login"
// //           initialValues={{ remember: true }}
// //           onFinish={onFinish}
// //           size="large"
// //         >
// //           <Form.Item
// //             name="email"
// //             rules={[
// //               { required: true, message: 'Please enter your email!' },
// //               { type: 'email', message: 'Please enter a valid email!' }
// //             ]}
// //           >
// //             <Input
// //               prefix={<UserOutlined />}
// //               placeholder="Email"
// //               autoComplete="username"
// //             />
// //           </Form.Item>

// //           <Form.Item
// //             name="password"
// //             rules={[{ required: true, message: 'Please enter your password!' }]}
// //           >
// //             <Input.Password
// //               prefix={<LockOutlined />}
// //               placeholder="Password"
// //               autoComplete="current-password"
// //             />
// //           </Form.Item>

// //           <Form.Item>
// //             <Button
// //               type="primary"
// //               htmlType="submit"
// //               loading={loading}
// //               block
// //             >
// //               Log in
// //             </Button>
// //           </Form.Item>
// //         </Form>
        
// //         <div className="login-footer">
// //           <p>Demo Credentials:</p>
// //           <p>Executive: exec@company.com / pass123</p>
// //           <p>Team Lead: lead@company.com / pass123</p>
// //           <p>Management: mgmt@company.com / pass123</p>
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default Login;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('executive');
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Mock user data based on role
//     const mockUsers = {
//       executive: {
//         id: 1,
//         name: "Rajesh Kumar",
//         email: "rajesh@company.com",
//         role: "executive"
//       },
//       teamlead: {
//         id: 2,
//         name: "Anjali Mehta",
//         email: "anjali@company.com",
//         role: "teamlead"
//       },
//       management: {
//         id: 3,
//         name: "Vikram Singh",
//         email: "vikram@company.com",
//         role: "management"
//       }
//     };

//     // Set user in localStorage (simulating auth)
//     localStorage.setItem('user', JSON.stringify(mockUsers[role]));
    
//     // Navigate to respective dashboard
//     navigate(`/${role}`);
//   };

//   const handleQuickLogin = (userRole) => {
//     setRole(userRole);
//     setEmail(`${userRole}@company.com`);
//     setPassword('password123');
    
//     setTimeout(() => {
//       const event = new Event('submit', { cancelable: true });
//       document.querySelector('form').dispatchEvent(event);
//     }, 100);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <div className="login-header">
//           <h1>FieldTrack Pro</h1>
//           <p>Field Marketing Performance Tracking System</p>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Role</label>
//             <select 
//               value={role} 
//               onChange={(e) => setRole(e.target.value)}
//               className="input-field"
//             >
//               <option value="executive">Field Executive</option>
//               <option value="teamlead">Team Lead</option>
//               <option value="management">Management</option>
//             </select>
//           </div>
          
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="input-field"
//               placeholder="Enter your email"
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="input-field"
//               placeholder="Enter your password"
//               required
//             />
//           </div>
          
//           <button type="submit" className="btn btn-block">
//             Login to Dashboard
//           </button>
//         </form>
        
//         <div style={{ marginTop: '30px', textAlign: 'center' }}>
//           <p style={{ color: '#666', marginBottom: '15px' }}>Quick Login (Demo)</p>
//           <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
//             <button 
//               type="button" 
//               className="btn"
//               onClick={() => handleQuickLogin('executive')}
//               style={{ padding: '10px 15px' }}
//             >
//               👤 Executive
//             </button>
//             <button 
//               type="button" 
//               className="btn"
//               onClick={() => handleQuickLogin('teamlead')}
//               style={{ padding: '10px 15px' }}
//             >
//               👥 Team Lead
//             </button>
//             <button 
//               type="button" 
//               className="btn"
//               onClick={() => handleQuickLogin('management')}
//               style={{ padding: '10px 15px' }}
//             >
//               🏢 Management
//             </button>
//           </div>
//         </div>
        
//         <div style={{ 
//           marginTop: '30px', 
//           padding: '15px', 
//           backgroundColor: '#f8f9fa', 
//           borderRadius: '6px',
//           fontSize: '12px',
//           color: '#666'
//         }}>
//           <strong>Note:</strong> This is a frontend-only demo. No backend is connected.
//           All data is mock data for UI demonstration.
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('executive');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    // Mock user data based on role
    const mockUsers = {
      executive: {
        id: 1,
        name: "Rajesh Kumar",
        email: email,
        role: "executive"
      },
      teamlead: {
        id: 2,
        name: "Anjali Mehta",
        email: email,
        role: "teamlead"
      },
      management: {
        id: 3,
        name: "Vikram Singh",
        email: email,
        role: "management"
      }
    };

    // Simulate authentication
    const user = mockUsers[role];
    
    if (user) {
      // Call the login function from props
      login(user);
      
      // Navigate to the appropriate dashboard
      navigate(`/${role}`);
    } else {
      setError('Invalid login credentials');
    }
  };

  const handleQuickLogin = (userRole) => {
    setRole(userRole);
    setEmail(`${userRole}@company.com`);
    setPassword('password123');
    
    // Automatically submit after a brief delay
    setTimeout(() => {
      const mockUser = {
        executive: {
          id: 1,
          name: "Rajesh Kumar",
          email: "executive@company.com",
          role: "executive"
        },
        teamlead: {
          id: 2,
          name: "Anjali Mehta",
          email: "teamlead@company.com",
          role: "teamlead"
        },
        management: {
          id: 3,
          name: "Vikram Singh",
          email: "management@company.com",
          role: "management"
        }
      }[userRole];
      
      login(mockUser);
      navigate(`/${userRole}`);
    }, 100);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>FieldTrack Pro</h1>
          <p>Field Marketing Performance Tracking System</p>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
            >
              <option value="executive">Field Executive</option>
              <option value="teamlead">Team Lead</option>
              <option value="management">Management</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-block">
            Login to Dashboard
          </button>
        </form>
        
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '15px' }}>Quick Login (Demo)</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              type="button" 
              className="btn"
              onClick={() => handleQuickLogin('executive')}
              style={{ padding: '10px 15px' }}
            >
              👤 Executive
            </button>
            <button 
              type="button" 
              className="btn"
              onClick={() => handleQuickLogin('teamlead')}
              style={{ padding: '10px 15px' }}
            >
              👥 Team Lead
            </button>
            <button 
              type="button" 
              className="btn"
              onClick={() => handleQuickLogin('management')}
              style={{ padding: '10px 15px' }}
            >
              🏢 Management
            </button>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '6px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Demo Credentials:</strong><br/>
          Email: any email works<br/>
          Password: any password works<br/>
          Select role and click Login
        </div>
      </div>
    </div>
  );
};

export default Login;
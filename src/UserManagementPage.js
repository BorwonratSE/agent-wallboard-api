// UserManagementPage.js
import React, { useState, useEffect } from 'react';
import { Button, Modal, message, Spin } from 'antd';
import UserTable from './components/UserTable';
import UserFormModal from './components/UserFormModal';
import { userAPI } from './services/userAPI';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ โหลด Users ตอนเปิดหน้า
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await userAPI.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // ✅ สร้างผู้ใช้ใหม่
  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // ✅ แก้ไขผู้ใช้
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // ✅ ลบผู้ใช้
  const handleDeleteUser = async (userId) => {
    Modal.confirm({
      title: 'ยืนยันการลบผู้ใช้',
      content: 'คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?',
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      async onOk() {
        try {
          await userAPI.deleteUser(userId);
          message.success('ลบผู้ใช้สำเร็จ');
          const refreshed = await userAPI.getAllUsers();
          setUsers(refreshed);
        } catch (err) {
          console.error(err);
          message.error('ไม่สามารถลบผู้ใช้ได้');
        }
      },
    });
  };

  // ✅ บันทึกข้อมูลผู้ใช้ (create / update)
  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        // Edit mode
        await userAPI.updateUser(selectedUser.id, userData);
        message.success('อัปเดตข้อมูลผู้ใช้สำเร็จ');
      } else {
        // Create mode
        await userAPI.createUser(userData);
        message.success('เพิ่มผู้ใช้ใหม่สำเร็จ');
      }

      setIsModalOpen(false);
      const refreshed = await userAPI.getAllUsers();
      setUsers(refreshed);
    } catch (err) {
      console.error(err);
      message.error('บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      <Button type="primary" onClick={handleCreateUser} className="mb-3">
        + Add User
      </Button>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {loading ? (
        <div className="text-center my-5">
          <Spin size="large" />
        </div>
      ) : (
        <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
      )}

      <UserFormModal
        isOpen={isModalOpen}
        user={selectedUser}
        onSave={handleSaveUser}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default UserManagementPage;

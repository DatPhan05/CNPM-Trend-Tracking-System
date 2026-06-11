import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trash2, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, admins: 0 });

  useEffect(() => {
    // Basic route guard
    const role = localStorage.getItem('user_role');
    if (role !== 'ADMIN') {
      toast.error('Truy cập bị từ chối!');
      navigate('/');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      // RESTful: users is a top-level resource, not a sub-resource of auth
      const { data } = await api.get('/users');
      setUsers(data.users);
      setStats({
        total: data.count,
        admins: data.users.filter((u: any) => u.role === 'admin').length
      });
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string, role: string) => {
    if (role === 'ADMIN') {
      toast.error('Không thể xóa tài khoản Quản trị viên!');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}" không?`)) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      toast.success('Đã xóa tài khoản thành công');
      fetchUsers(); // Refresh list
    } catch (error) {
      toast.error('Lỗi khi xóa tài khoản');
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 md:py-32 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-amber-500" />
          Bảng điều khiển Quản trị
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý người dùng và theo dõi tình trạng hệ thống.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-xl">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng số người dùng</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-amber-500/10 rounded-xl">
            <ShieldAlert className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Số lượng Admin</p>
            <p className="text-3xl font-bold text-foreground">{stats.admins}</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-border">
        <div className="p-6 border-b border-border bg-card">
          <h2 className="text-xl font-bold text-foreground">Danh sách người dùng</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                  <th className="px-6 py-4 font-medium">Tên người dùng</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Quyền hạn</th>
                  <th className="px-6 py-4 font-medium text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{user.fullName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-amber-500/10 text-amber-600' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.fullName, user.role)}
                        disabled={user.role === 'ADMIN'}
                        className={`p-2 rounded-lg transition-colors ${
                          user.role === 'ADMIN'
                            ? 'text-muted-foreground opacity-50 cursor-not-allowed'
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

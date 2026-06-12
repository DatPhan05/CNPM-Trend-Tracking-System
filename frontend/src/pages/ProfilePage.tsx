import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Lock,
  Save,
  Key,
  ShieldCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { isAuthenticated, updateUser } = useAuth();
  const isLoggedIn = isAuthenticated;

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để truy cập trang cá nhân');
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        const user = res.data.user;
        setProfile(user);
        setFullName(user.fullName);
        setEmail(user.email);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        toast.error('Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isLoggedIn, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error('Vui lòng điền đầy đủ Họ tên và Email');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', { fullName, email });
      const updatedUser = res.data.user;
      
      setProfile(updatedUser);
      
      // Update global context
      updateUser({ fullName: updatedUser.fullName, email: updatedUser.email });
      
      toast.success('Cập nhật thông tin cá nhân thành công!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không thể cập nhật thông tin');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp');
      return;
    }

    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Thay đổi mật khẩu thành công!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không thể đổi mật khẩu');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-6">
        <span>Bảng điều khiển</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Trang cá nhân</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Overview Panel */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden text-center group">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-blue-500 to-indigo-500" />
            
            {/* Avatar */}
            <div className="w-24 h-24 mx-auto mt-4 mb-4 rounded-3xl bg-primary/10 text-primary text-3xl font-bold flex items-center justify-center shadow-inner relative group-hover:scale-105 transition-transform duration-300">
              {profile?.fullName.split(' ').pop()?.[0]?.toUpperCase() || 'U'}
              <div className="absolute inset-0 rounded-3xl bg-primary/5 animate-pulse" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-1">{profile?.fullName}</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6">
              <Shield className="h-3.5 w-3.5" /> {profile?.role || 'STUDENT'}
            </span>

            {/* Quick Details */}
            <div className="space-y-4 pt-6 border-t border-border text-left">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="p-2 bg-secondary rounded-lg">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground/60 font-semibold uppercase tracking-wider">Email liên hệ</p>
                  <p className="text-foreground font-medium truncate">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="p-2 bg-secondary rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/60 font-semibold uppercase tracking-wider">Thành viên từ</p>
                  <p className="text-foreground font-medium">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Tip */}
          <div className="bg-gradient-to-br from-primary/5 to-indigo-500/5 border border-primary/10 rounded-2xl p-6 text-sm">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Hệ thống Trend Scholar
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Bạn có thể cập nhật thông tin cá nhân và mật khẩu của mình bất cứ lúc nào. Đảm bảo sử dụng email chính xác để nhận các thông báo hệ thống và cập nhật xu hướng khoa học mới nhất.
            </p>
          </div>
        </div>

        {/* Right Side: Configuration Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Edit Profile Form */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Cập nhật thông tin cá nhân
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Nhập họ và tên..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Địa chỉ Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/95 transition-all shadow-md disabled:opacity-50 disabled:cursor-wait"
                >
                  <Save className="h-4 w-4" />
                  {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" /> Thay đổi mật khẩu
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Mật khẩu hiện tại</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-secondary/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Ít nhất 8 ký tự..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Nhập lại mật khẩu mới</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Nhập lại mật khẩu mới..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/95 transition-all shadow-md disabled:opacity-50 disabled:cursor-wait"
                >
                  <Key className="h-4 w-4" />
                  {savingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

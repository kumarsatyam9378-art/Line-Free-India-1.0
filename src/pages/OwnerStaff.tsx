import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, StaffMember } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export default function OwnerStaff() {
  const { user, barberProfile, t } = useApp();
  const nav = useNavigate();

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editStaffId, setEditStaffId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Barber');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Available');
  const [workingDays, setWorkingDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, `businesses/${user.uid}/staff`), snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as StaffMember));
      setStaffList(list);
      setLoading(false);
    }, err => {
      console.error(err);
      toast.error('Failed to load staff list');
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const toggleDay = (day: string) => {
    setWorkingDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = async () => {
    if (!user || !name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const id = editStaffId || Date.now().toString();
      const staffRef = doc(db, `businesses/${user.uid}/staff`, id);

      await setDoc(staffRef, {
        id,
        name,
        role,
        phone,
        status,
        workingDays,
      }, { merge: true });

      toast.success(editStaffId ? 'Staff updated' : 'Staff added');
      resetForm();
    } catch (err) {
      toast.error('Failed to save staff member');
    }
  };

  const editStaff = (s: StaffMember & { workingDays?: string[], status?: string }) => {
    setEditStaffId(s.id!);
    setName(s.name || '');
    setRole(s.role || 'Barber');
    setPhone(s.phone || '');
    setStatus(s.status || 'Available');
    setWorkingDays(s.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;

    try {
      await deleteDoc(doc(db, `businesses/${user.uid}/staff`, id));
      toast.success('Staff removed');
    } catch {
      toast.error('Failed to remove staff');
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditStaffId(null);
    setName('');
    setRole('Barber');
    setPhone('');
    setStatus('Available');
    setWorkingDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  };

  const statusColors: Record<string, string> = {
    Available: 'bg-success text-white',
    Busy: 'bg-warning text-white',
    Off: 'bg-danger text-white'
  };

  return (
    <div className="screen-scroll pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/home" />
        <h1 className="text-2xl font-bold mb-5">Staff Management</h1>

        {!showAddForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-text-dim text-sm">{staffList.length} staff members</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary text-sm py-2 px-4"
              >
                + Add Staff
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-8"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : staffList.length === 0 ? (
              <div className="text-center p-8 bg-card rounded-2xl border border-border">
                <p className="text-text-dim">No staff added yet.</p>
                <p className="text-xs text-text-dim/60 mt-2">Add staff members to assign them to bookings and track individual performance.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {staffList.map((s: any) => (
                  <div key={s.id} className="p-4 bg-card rounded-2xl border border-border flex flex-col gap-3 group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-card-2 flex items-center justify-center text-lg shrink-0">
                          👤
                        </div>
                        <div>
                          <h3 className="font-bold text-base">{s.name}</h3>
                          <p className="text-text-dim text-xs">{s.role}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${statusColors[s.status || 'Available']}`}>
                        {s.status || 'Available'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-t border-border pt-3">
                      <div className="flex gap-1">
                        {allDays.map(day => (
                          <span key={day} className={`w-6 h-6 rounded-md flex items-center justify-center font-medium ${s.workingDays?.includes(day) ? 'bg-primary/20 text-primary' : 'bg-card-2 text-text-dim opacity-50'}`}>
                            {day[0]}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => editStaff(s)} className="text-primary text-sm">✏️</button>
                        <button onClick={() => handleDelete(s.id)} className="text-danger text-sm">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-card p-5 rounded-2xl border border-border animate-fadeIn">
            <h2 className="text-lg font-bold mb-4">{editStaffId ? 'Edit Staff Member' : 'Add Staff Member'}</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-dim block mb-1">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-dim block mb-1">Role/Title</label>
                  <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Senior Stylist" className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-text-dim block mb-1">Phone (Optional)</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="input-field" type="tel" />
                </div>
              </div>

              <div>
                <label className="text-xs text-text-dim block mb-2">Current Status</label>
                <div className="flex gap-2">
                  {['Available', 'Busy', 'Off'].map(st => (
                    <button
                      key={st}
                      onClick={() => setStatus(st)}
                      className={`flex-1 py-2 text-xs rounded-xl font-bold transition-colors ${status === st ? statusColors[st] : 'bg-card-2 text-text-dim border border-border hover:border-primary/30'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-text-dim block mb-2">Working Days</label>
                <div className="flex justify-between gap-1">
                  {allDays.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${workingDays.includes(day) ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-card-2 text-text-dim border border-border hover:bg-card-2/80'}`}
                    >
                      {day.substring(0,3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={resetForm} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium">Cancel</button>
              <button onClick={handleSave} className="flex-1 btn-primary text-sm py-3">Save Staff</button>
            </div>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}

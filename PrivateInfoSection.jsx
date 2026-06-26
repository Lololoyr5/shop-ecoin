import React, { useState } from 'react';
import { Lock, Phone, MapPin, Calendar, User, Eye, EyeOff, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

export default function PrivateInfoSection({ profile, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState({
    phone: profile?.phone || '',
    address: profile?.address || '',
    birth_date: profile?.birth_date || '',
    full_real_name: profile?.full_real_name || ''
  });

  const handleSave = async () => {
    await base44.entities.UserProfile.update(profile.id, data);
    onUpdate();
    setEditing(false);
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-8 border border-violet-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center">
            <Lock className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Informations privées</h3>
            <p className="text-xs text-slate-500">Seulement vous pouvez voir ceci</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowData(!showData)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {showData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {!editing && (
            <button
              onClick={() => { setEditing(true); setShowData(true); }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {showData && (
        <div className="space-y-3">
          {editing ? (
            <>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Input
                  value={data.full_real_name}
                  onChange={e => setData({...data, full_real_name: e.target.value})}
                  placeholder="Nom complet réel"
                  className="bg-white/5 border-white/10 text-white h-9 text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Input
                  value={data.phone}
                  onChange={e => setData({...data, phone: e.target.value})}
                  placeholder="Téléphone"
                  className="bg-white/5 border-white/10 text-white h-9 text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Input
                  value={data.address}
                  onChange={e => setData({...data, address: e.target.value})}
                  placeholder="Adresse complète"
                  className="bg-white/5 border-white/10 text-white h-9 text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Input
                  type="date"
                  value={data.birth_date}
                  onChange={e => setData({...data, birth_date: e.target.value})}
                  className="bg-white/5 border-white/10 text-white h-9 text-sm"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={handleSave} className="bg-violet-500 hover:bg-violet-600 flex-1">
                  <Check className="w-4 h-4 mr-1" /> Guardar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="border-white/10 text-white hover:bg-white/10">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              {[
                { icon: User, label: 'Nom réel', value: data.full_real_name },
                { icon: Phone, label: 'Téléphone', value: data.phone },
                { icon: MapPin, label: 'Adresse', value: data.address },
                { icon: Calendar, label: 'Naissance', value: data.birth_date },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-1.5">
                  <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="text-xs text-slate-500 w-20 flex-shrink-0">{label}</span>
                  <span className="text-sm text-slate-200">{value || <span className="text-slate-600 italic">No configurado</span>}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!showData && (
        <p className="text-slate-500 text-sm">Cliquez sur l'œil pour voir vos informations privées</p>
      )}
    </div>
  );
}

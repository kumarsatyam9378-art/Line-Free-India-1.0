import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, ServiceItem, BusinessCategory } from '../store/AppContext';
import BackButton from '../components/BackButton';
import BusinessTypeSetup from './setup/BusinessTypeSetup';
import ServicesSetup from './setup/ServicesSetup';
import HoursSetup, { WeeklyHours, DEFAULT_WEEKLY_HOURS } from './setup/HoursSetup';
import SetupComplete from './setup/SetupComplete';
import { BUSINESS_CATEGORIES_INFO } from '../constants/businessRegistry';

export default function BarberProfileSetup() {
  const { user, saveBarberProfile, barberProfile, uploadPhoto, t } = useApp();
  const nav = useNavigate();
  
  // Try to resume from saved step, default to 1
  const [step, setStep] = useState((barberProfile as any)?.setupStep || 1);
  const totalSteps = 6;

  // Basic Info (Step 1)
  const [businessNameEn, setBusinessNameEn] = useState(barberProfile?.businessName || barberProfile?.salonName || '');
  const [businessNameHi, setBusinessNameHi] = useState((barberProfile as any)?.businessNameHi || '');
  const [name, setName] = useState(barberProfile?.name || user?.displayName || '');
  const [phone, setPhone] = useState(barberProfile?.phone || '');
  const [city, setCity] = useState((barberProfile as any)?.city || '');
  const [state, setState] = useState((barberProfile as any)?.state || '');
  const [address, setAddress] = useState(barberProfile?.location || '');

  // Business Type (Step 2)
  const [businessType, setBusinessType] = useState<BusinessCategory>(barberProfile?.businessType || 'men_salon');

  // Services (Step 3)
  const [services, setServices] = useState<ServiceItem[]>(barberProfile?.services || []);

  // Photos (Step 4)
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(barberProfile?.bannerImageURL || '');
  const [logoPhotoUrl, setLogoPhotoUrl] = useState(barberProfile?.salonImageURL || '');
  const [uploading, setUploading] = useState(false);

  // Hours (Step 5)
  const [hours, setHours] = useState<WeeklyHours>(
    typeof barberProfile?.businessHours === 'string'
      ? JSON.parse(barberProfile.businessHours)
      : DEFAULT_WEEKLY_HOURS
  );

  const saveProgress = async (nextStep: number) => {
    const profile = {
      uid: user?.uid || '',
      name: name || user?.displayName || 'Owner',
      salonName: businessNameEn || 'My Business',
      businessName: businessNameEn || 'My Business',
      businessNameHi: businessNameHi,
      businessType: businessType,
      location: address || '',
      city,
      state,
      phone: phone || '',
      photoURL: user?.photoURL || '',
      salonImageURL: logoPhotoUrl,
      bannerImageURL: coverPhotoUrl,
      services,
      businessHours: JSON.stringify(hours),
      isOpen: barberProfile?.isOpen ?? true,
      isBreak: barberProfile?.isBreak ?? false,
      isStopped: barberProfile?.isStopped ?? false,
      currentToken: barberProfile?.currentToken ?? 0,
      totalTokensToday: barberProfile?.totalTokensToday ?? 0,
      breakStartTime: barberProfile?.breakStartTime ?? null,
      createdAt: barberProfile?.createdAt || Date.now(),
      setupStep: nextStep
    };
    await saveBarberProfile(profile);
  };

  const handleNext = async () => {
    const nextStep = step + 1;
    setStep(nextStep);
    await saveProgress(nextStep);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleBusinessTypeSelect = async (typeId: BusinessCategory) => {
    setBusinessType(typeId);
    let updatedServices = services;
    if (services.length === 0) {
      const categoryInfo = BUSINESS_CATEGORIES_INFO.find(c => c.id === typeId);
      if (categoryInfo) {
        updatedServices = categoryInfo.defaultServices;
        setServices(updatedServices);
      }
    }
    const nextStep = 3;
    setStep(nextStep);

    // Save state explicitly here since we just modified it
    const profile = {
      ...barberProfile,
      uid: user?.uid || '',
      name: name || user?.displayName || 'Owner',
      businessType: typeId,
      services: updatedServices,
      setupStep: nextStep
    };
    await saveBarberProfile(profile as any);
  };

  const handlePhotoUpload = async (file: File, type: 'cover' | 'logo') => {
    try {
      setUploading(true);
      const url = await uploadPhoto(file, 'business_photos');
      if (type === 'cover') setCoverPhotoUrl(url);
      else setLogoPhotoUrl(url);
    } catch (e) {
      console.error('Upload failed', e);
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleComplete = async () => {
    // Save final state
    await saveProgress(6);
  };

  // If complete, show success component
  if (step === 6) {
    return <SetupComplete businessName={businessNameEn || 'Your Business'} />;
  }

  return (
    <div className="min-h-screen flex flex-col p-6 pb-24 animate-fadeIn bg-bg">
      {step < 6 && (
        <div className="mb-6 flex items-center justify-between">
          <BackButton onClick={() => step > 1 ? handleBack() : nav('/role')} />
          <div className="text-sm font-semibold text-text-dim">
            Step {step} of {totalSteps - 1}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {step < 6 && (
        <div className="w-full bg-border rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {step === 1 && (
          <div className="flex flex-col animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Basic Information</h1>
              <p className="text-text-dim text-sm mt-1">Let's start with the basics of your business</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Business Name (English)</label>
                <input value={businessNameEn} onChange={e => setBusinessNameEn(e.target.value)} placeholder="e.g. Royal Salon" className="input-field w-full" />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Business Name (Hindi) <span className="text-text-dim font-normal">(Optional)</span></label>
                <input value={businessNameHi} onChange={e => setBusinessNameHi(e.target.value)} placeholder="e.g. रॉयल सैलून" className="input-field w-full" />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Owner Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="input-field w-full" />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXXXXXXX" className="input-field w-full" type="tel" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">City</label>
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="input-field w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">State</label>
                  <input value={state} onChange={e => setState(e.target.value)} placeholder="State" className="input-field w-full" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street, Landmark, Pincode"
                  className="input-field w-full resize-none h-24"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleNext}
                className="w-full btn-primary py-3 rounded-xl font-semibold disabled:opacity-50"
                disabled={!businessNameEn || !name || !phone}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <BusinessTypeSetup
            initialType={businessType}
            onSelect={handleBusinessTypeSelect}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <ServicesSetup
            services={services}
            setServices={setServices}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 4 && (
          <div className="flex flex-col animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Business Photos</h1>
              <p className="text-text-dim text-sm mt-1">Add photos to attract more customers</p>
            </div>

            <div className="space-y-6">
              {/* Cover Photo */}
              <div>
                <label className="text-sm font-medium mb-2 block">Cover Photo (16:9)</label>
                <div className="relative w-full aspect-video bg-card rounded-2xl border-2 border-dashed border-border overflow-hidden group">
                  {coverPhotoUrl ? (
                    <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-text-dim">
                      <span className="text-3xl mb-2">📸</span>
                      <span className="text-sm font-medium">Upload Cover</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files?.[0] && handlePhotoUpload(e.target.files[0], 'cover')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}
                </div>
              </div>

              {/* Logo Photo */}
              <div>
                <label className="text-sm font-medium mb-2 block">Business Logo (1:1)</label>
                <div className="relative w-32 h-32 mx-auto bg-card rounded-full border-2 border-dashed border-border overflow-hidden group">
                  {logoPhotoUrl ? (
                    <img src={logoPhotoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-text-dim">
                      <span className="text-2xl mb-1">🏢</span>
                      <span className="text-xs font-medium">Upload Logo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files?.[0] && handlePhotoUpload(e.target.files[0], 'logo')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 flex gap-3">
              <button onClick={handleBack} className="btn-secondary flex-1 py-3 rounded-xl font-semibold">
                Back
              </button>
              <button onClick={handleNext} className="btn-primary flex-1 py-3 rounded-xl font-semibold" disabled={uploading}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <HoursSetup
            hours={hours}
            setHours={setHours}
            onNext={() => { handleComplete(); setStep(6); }}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

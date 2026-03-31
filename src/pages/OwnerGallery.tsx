import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

export default function OwnerGallery() {
  const { user, barberProfile, saveBarberProfile, uploadPhoto, isBarberSubscribed, t } = useApp();
  const nav = useNavigate();

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  // Cropping state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropType, setCropType] = useState<'logo' | 'cover' | 'gallery'>('logo');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  // Pending files for multi-gallery upload
  const [pendingGalleryFiles, setPendingGalleryFiles] = useState<File[]>([]);

  const isPro = isBarberSubscribed();
  const maxGalleryImages = isPro ? 30 : 5;
  const portfolioItems = barberProfile?.portfolioItems || [];

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover' | 'gallery') => {
    if (e.target.files && e.target.files.length > 0) {
      if (type === 'gallery' && e.target.files.length > 1) {
        // Multi-upload: skip crop for simplicity if multiple files are selected at once
        handleGalleryMultiUpload(e.target.files);
        return;
      }

      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropImageSrc(reader.result?.toString() || null);
        setCropType(type);
      });
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = '';
  };

  const handleCropSubmit = async () => {
    if (!cropImageSrc || !croppedAreaPixels || !user || !barberProfile) return;

    try {
      const croppedFile = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      if (!croppedFile) throw new Error("Failed to crop image");

      setCropImageSrc(null); // close modal

      if (cropType === 'logo') {
        await processLogoUpload(croppedFile);
      } else if (cropType === 'cover') {
        await processCoverUpload(croppedFile);
      } else if (cropType === 'gallery') {
        await processSingleGalleryUpload(croppedFile);
      }
    } catch (e) {
      console.error(e);
      toast.error('Crop failed');
    }
  };

  const processLogoUpload = async (file: File) => {
    if (!user || !barberProfile) return;
    setUploadingLogo(true);
    try {
      const url = await uploadPhoto(file, `line-free/businesses/${user.uid}/logo`);
      await saveBarberProfile({ ...barberProfile, photoURL: url });
      toast.success('Logo updated');
    } catch { toast.error('Upload failed'); }
    setUploadingLogo(false);
  };

  const processCoverUpload = async (file: File) => {
    if (!user || !barberProfile) return;
    setUploadingCover(true);
    try {
      const url = await uploadPhoto(file, `line-free/businesses/${user.uid}/cover`);
      await saveBarberProfile({ ...barberProfile, bannerImageURL: url, salonImageURL: url });
      toast.success('Cover photo updated');
    } catch { toast.error('Upload failed'); }
    setUploadingCover(false);
  };

  const processSingleGalleryUpload = async (file: File) => {
    if (!user || !barberProfile) return;
    setUploadingGallery(true);
    try {
      const url = await uploadPhoto(file, `line-free/businesses/${user.uid}/gallery`);
      const newItems = [...portfolioItems, { id: Date.now().toString(), imageURL: url }];
      await saveBarberProfile({ ...barberProfile, portfolioItems: newItems });
      toast.success('Gallery updated');
    } catch { toast.error('Upload failed'); }
    setUploadingGallery(false);
  };

  const handleGalleryMultiUpload = async (files: FileList) => {
    if (!user || !barberProfile) return;
    if (portfolioItems.length + files.length > maxGalleryImages) {
      toast.error(`You can only upload up to ${maxGalleryImages} images. Current: ${portfolioItems.length}`);
      return;
    }

    setUploadingGallery(true);
    try {
      const newItems = [...portfolioItems];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadPhoto(file, `line-free/businesses/${user.uid}/gallery`);
        newItems.push({ id: Date.now().toString() + i, imageURL: url });
      }
      await saveBarberProfile({ ...barberProfile, portfolioItems: newItems });
      toast.success('Gallery updated');
    } catch { toast.error('Some uploads failed'); }
    setUploadingGallery(false);
  };

  const deleteGalleryImage = async (id: string) => {
    if (!barberProfile) return;
    const newItems = portfolioItems.filter(item => item.id !== id);
    await saveBarberProfile({ ...barberProfile, portfolioItems: newItems });
    toast.success('Image deleted');
  };

  const photoURL = barberProfile?.photoURL;
  const bannerImageURL = barberProfile?.bannerImageURL || barberProfile?.salonImageURL;

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/home" />
        <h1 className="text-2xl font-bold mb-5">Gallery Manager</h1>

        {/* Cover Photo (16:9) */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-text-dim mb-2">Cover Photo (16:9)</h2>
          <div className="relative w-full aspect-video rounded-2xl bg-card-2 border border-border overflow-hidden group">
            {bannerImageURL ? (
              <img src={bannerImageURL} className="w-full h-full object-cover" alt="Cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-text-dim opacity-50">
                <span className="text-3xl mb-2">🖼️</span>
                <span className="text-xs">No Cover Photo</span>
              </div>
            )}
            <button
              onClick={() => coverRef.current?.click()}
              disabled={uploadingCover}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              {uploadingCover ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-white font-medium flex items-center gap-2">📷 Change Cover</span>
              )}
            </button>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileSelect(e, 'cover')} />
          </div>
        </div>

        {/* Logo (1:1) */}
        <div className="mb-8 flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
          <div className="relative w-20 h-20 rounded-2xl bg-card-2 overflow-hidden ring-2 ring-primary/30 group shrink-0">
            {photoURL ? (
              <img src={photoURL} className="w-full h-full object-cover" alt="Logo" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-text-dim opacity-50">
                <span className="text-2xl mb-1">💈</span>
                <span className="text-[10px]">No Logo</span>
              </div>
            )}
            <button
              onClick={() => logoRef.current?.click()}
              disabled={uploadingLogo}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              {uploadingLogo ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-white text-xs font-medium">📷</span>
              )}
            </button>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileSelect(e, 'logo')} />
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-1">Business Logo (1:1)</h2>
            <p className="text-xs text-text-dim leading-relaxed">This logo appears in search results and your profile header.</p>
          </div>
        </div>

        {/* Portfolio / Gallery */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold">Portfolio Gallery</h2>
              <p className="text-xs text-text-dim">
                {portfolioItems.length} / {maxGalleryImages} images used
              </p>
            </div>
            {!isPro && portfolioItems.length >= maxGalleryImages && (
              <button onClick={() => nav('/barber/subscription')} className="text-[10px] px-2 py-1 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold uppercase tracking-wider">
                Upgrade to Pro
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Add New Button */}
            <button
              onClick={() => galleryRef.current?.click()}
              disabled={uploadingGallery || portfolioItems.length >= maxGalleryImages}
              className="aspect-square rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
            >
              {uploadingGallery ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-2xl mb-1">+</span>
                  <span className="text-[10px] font-medium">Add Photo</span>
                </>
              )}
            </button>
            <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFileSelect(e, 'gallery')} />

            {/* Gallery Images */}
            {portfolioItems.map((item) => (
              <div key={item.id} className="relative aspect-square rounded-xl bg-card-2 border border-border overflow-hidden group">
                <img src={item.imageURL} className="w-full h-full object-cover" alt="" />
                <button
                  onClick={() => deleteGalleryImage(item.id!)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-danger/80 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
      <BottomNav />

      {/* Crop Modal */}
      {cropImageSrc && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur flex flex-col items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-card rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col" style={{ height: '80vh' }}>
            <div className="p-4 border-b border-border flex justify-between items-center bg-card-2 z-10">
              <h3 className="font-bold">Crop Image</h3>
              <button onClick={() => setCropImageSrc(null)} className="text-text-dim hover:text-text p-1 text-2xl leading-none">&times;</button>
            </div>

            <div className="relative flex-1 bg-black">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropType === 'cover' ? 16 / 9 : cropType === 'logo' ? 1 : 1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-4 bg-card-2 border-t border-border z-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-dim">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCropImageSrc(null)} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium">Cancel</button>
                <button onClick={handleCropSubmit} className="flex-1 btn-primary text-sm py-3">Apply & Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

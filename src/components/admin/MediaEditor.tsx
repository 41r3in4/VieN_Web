'use client';
/* eslint-disable @next/next/no-img-element -- Media previews use local object URLs and authenticated image requests. */

import { useState,useEffect,useRef,type ChangeEvent } from 'react';
import { X,ImagePlus,Video,Upload,LoaderCircle } from 'lucide-react';
import { useMedia } from '@/context/MediaContext';
import { useModalDialog } from '@/components/experience/useModalDialog';

async function coverImage(file: File): Promise<Blob> {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 10*1024*1024) throw new Error('Chọn ảnh JPG, PNG hoặc WebP tối đa 10 MB.');
  const image = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1600; canvas.height = 900;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Trình duyệt chưa xử lý được ảnh.');
    const width = Math.min(image.width,image.height*16/9);
    const height = width*9/16;
    context.drawImage(image,(image.width-width)/2,(image.height-height)/2,width,height,0,0,1600,900);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve,'image/webp',.85));
    if (!blob || blob.type !== 'image/webp' || blob.size > 2*1024*1024) throw new Error('Ảnh quá lớn sau khi nén. Vui lòng chọn ảnh khác.');
    return blob;
  } finally { image.close(); }
}

export function MediaEditor() {
  const { destinations,catalog,editingDestinationId,closeMediaEditor,updateCatalog } = useMedia();
  const [cover,setCover] = useState<Blob>();
  const [video,setVideo] = useState<File>();
  const [coverPreview,setCoverPreview] = useState('');
  const [videoPreview,setVideoPreview] = useState('');
  const [pending,setPending] = useState<'cover' | 'video' | null>(null);
  const [preparing,setPreparing] = useState(false);
  const [percent,setPercent] = useState(0);
  const [message,setMessage] = useState('');
  const controller = useRef<AbortController | null>(null);
  const dialog = useModalDialog(!!editingDestinationId,closeMediaEditor,'Quản lý ảnh và video điểm đến');
  useEffect(() => () => controller.current?.abort(),[]);
  useEffect(() => () => { if (coverPreview) URL.revokeObjectURL(coverPreview); },[coverPreview]);
  useEffect(() => () => { if (videoPreview) URL.revokeObjectURL(videoPreview); },[videoPreview]);
  const destination = destinations.find(item => item.id === editingDestinationId);
  if (!destination || !catalog.isAdmin) return null;
  const current = catalog.media.find(item => item.destinationId === destination.id);

  async function choose(event: ChangeEvent<HTMLInputElement>,kind: 'cover' | 'video') {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    setMessage(''); setPreparing(true);
    try {
      if (kind === 'cover') { const blob = await coverImage(file); setCover(blob); setCoverPreview(URL.createObjectURL(blob)); }
      else {
        if (!['video/mp4','video/webm'].includes(file.type) || file.size > 50*1024*1024) throw new Error('Chọn video MP4 hoặc WebM tối đa 50 MB.');
        setVideo(file); setVideoPreview(URL.createObjectURL(file));
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Không thể đọc file.'); }
    finally { setPreparing(false); }
  }
  async function upload(kind: 'cover' | 'video') {
    const file = kind === 'cover' ? cover : video;
    if (!file || pending || !destination) return;
    const abort = new AbortController(); controller.current = abort;
    let uploadId: string | undefined;
    setPending(kind); setPercent(0); setMessage('');
    try {
      const started = await fetch('/api/admin/media/uploads',{ method: 'POST',headers: { 'Content-Type': 'application/json' },body: JSON.stringify({ destinationId: destination.id,kind,contentType: file.type,size: file.size }),signal: abort.signal });
      if (!started.ok) throw new Error(started.status === 403 ? 'Tài khoản không có quyền admin.' : 'Chưa tạo được phiên tải lên.');
      const data = await started.json(); uploadId = data.uploadId;
      for (let offset = 0,index = 0; offset < file.size; offset += data.chunkSize,index++) {
        const chunk = file.slice(offset,offset+data.chunkSize);
        let saved = false;
        for (let attempt = 0; attempt < 3 && !saved; attempt++) {
          const response = await fetch(`/api/admin/media/uploads/${uploadId}?index=${index}`,{ method: 'PUT',body: chunk,headers: { 'Content-Type': 'application/octet-stream' },signal: abort.signal });
          if (response.status === 403) throw new Error('Bạn không còn quyền cập nhật media.');
          saved = response.ok;
        }
        if (!saved) throw new Error('Tải lên bị gián đoạn. Ảnh/video hiện tại vẫn được giữ nguyên.');
        setPercent(Math.round(Math.min(file.size,offset+data.chunkSize)/file.size*95));
      }
      const published = await fetch(`/api/admin/media/uploads/${uploadId}/complete`,{ method: 'POST',signal: abort.signal });
      if (!published.ok) throw new Error('Chưa áp dụng được media. Vui lòng thử lại.');
      updateCatalog(await published.json());
      setPercent(100); setMessage('Đã cập nhật. Thành viên sẽ xem ảnh/video mới.');
      if (kind === 'cover') { setCover(undefined); setCoverPreview(''); } else { setVideo(undefined); setVideoPreview(''); }
    } catch (error) {
      setMessage(abort.signal.aborted ? 'Đã hủy tải lên.' : error instanceof Error ? error.message : 'Không thể tải lên. Vui lòng thử lại.');
      if (uploadId) void fetch(`/api/admin/media/uploads/${uploadId}`,{ method: 'DELETE' }).catch(() => {});
    } finally { setPending(null); controller.current = null; }
  }
  return <div {...dialog} className="media-editor-backdrop"><section className="media-editor-panel"><header><div><span className="auth-eyebrow">QUẢN TRỊ NỘI DUNG</span><h2>{destination.name}</h2></div><button onClick={closeMediaEditor} data-dialog-close type="button" aria-label="Đóng quản lý media"><X size={20} /></button></header><p className="media-editor-intro">Ảnh bìa và video được dùng chung cho banner, thẻ điểm đến và phần trailer. Thành viên chỉ có quyền xem.</p><fieldset disabled={!!pending || preparing} className="media-editor-fields">
    <section><h3><ImagePlus size={18} /> Ảnh bìa</h3><img src={coverPreview || destination.coverImage} alt="Xem trước ảnh bìa" /><label className="media-file-label">Chọn ảnh mới<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => void choose(event,'cover')} /></label><p>JPG, PNG, WebP · tối đa 10 MB · cắt giữa theo tỷ lệ 16:9.</p><button type="button" className="intro-primary" disabled={!cover || !!pending || preparing} onClick={() => void upload('cover')}><Upload size={16} /> Tải ảnh lên & áp dụng</button></section>
    <section><h3><Video size={18} /> Video trailer</h3>{videoPreview || current?.videoUrl ? <video src={videoPreview || current?.videoUrl} controls preload="metadata" /> : <div className="media-video-empty">Chưa có video do admin tải lên.</div>}<label className="media-file-label">Chọn video mới<input type="file" accept="video/mp4,video/webm" onChange={event => void choose(event,'video')} /></label><p>MP4, WebM · tối đa 50 MB/video.</p><button type="button" className="intro-primary" disabled={!video || !!pending || preparing} onClick={() => void upload('video')}><Upload size={16} /> Tải video lên & áp dụng</button></section>
  </fieldset>{preparing && <p role="status">Đang xử lý ảnh…</p>}{pending && <div className="media-upload-status" role="status"><LoaderCircle size={17} className="animate-spin" /><span>Đang tải {pending === 'cover' ? 'ảnh' : 'video'}… {percent}%</span><button onClick={() => controller.current?.abort()}>Hủy tải</button><progress value={percent} max={100} /></div>}{message && <p className="media-editor-message" role="status">{message}</p>}</section></div>;
}

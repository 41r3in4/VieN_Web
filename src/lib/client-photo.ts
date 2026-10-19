'use client';

export async function prepareChatPhoto(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Chọn ảnh JPG, PNG hoặc WebP.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Ảnh nguồn tối đa 8 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    const ratio = Math.min(1, 768 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Chưa xử lý được ảnh trên trình duyệt này.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/webp', .72);
    if (!image.startsWith('data:image/webp;') || image.length > 260000) throw new Error('Ảnh quá lớn sau khi nén. Vui lòng chọn ảnh nhỏ hơn.');
    return image;
  } finally { bitmap.close(); }
}

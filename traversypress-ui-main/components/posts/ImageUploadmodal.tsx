// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// interface Props {
//     open: boolean;
//     onClose: () => void;
//     newsId: number | null;
// }
// interface Image {
//     id: number;
//     imagepath: string;
//     imageid: number;
// }

// export default function ImageUploadModal({ open, onClose, newsId }: Props) {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [preview, setPreview] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [images, setImages] = useState<Image[]>([]);
//     const [isLoaded, setIsLoaded] = useState(false);

//     const fetchImages = useCallback(async () => {
//         try {
//             const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/image/${newsId}`);
//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err.message || 'Зураг татахад алдаа гарлаа');
//             }
//             const data = await res.json();
//             setImages(data.images);
//             setIsLoaded(true);
//         } catch (err) {
//             console.error('Алдаа:', err);
//         }
//     }, [newsId]);

//     useEffect(() => {
//         if (!open || newsId === null) return;

//         fetchImages();
//     }, [open, newsId]);

//     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file || !file.type.startsWith('image/')) return;

//         const compressed = await compressImage(file);
//         setSelectedFile(compressed);
//         setPreview(URL.createObjectURL(compressed));
//     };

//     const compressImage = (file: File, maxWidth = 600, quality = 0.5): Promise<File> => {
//         return new Promise((resolve, reject) => {
//             const image = document.createElement('img');
//             const reader = new FileReader();

//             reader.onload = (e) => {
//                 image.src = e.target?.result as string;
//             };

//             image.onload = () => {
//                 const canvas = document.createElement('canvas');
//                 const scaleFactor = maxWidth / image.width;
//                 canvas.width = maxWidth;
//                 canvas.height = image.height * scaleFactor;

//                 const ctx = canvas.getContext('2d');
//                 if (!ctx) return reject('Canvas not supported');

//                 ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

//                 canvas.toBlob((blob) => {
//                     if (!blob) return reject('Compression failed');
//                     resolve(new File([blob], file.name, { type: 'image/jpeg' }));
//                 }, 'image/jpeg', quality);
//             };

//             reader.readAsDataURL(file);
//         });
//     };

//     const handleDelete = async (imageId: number) => {
//         if (!confirm('Энэ зургийг устгах уу?')) return;

//         try {
//             const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/image/${imageId}`, {
//                 method: 'DELETE',
//             });

//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err.message || 'Устгах амжилтгүй');
//             }

//             setImages((prev) => prev.filter((img) => img.imageid !== imageId));
//         } catch (err) {
//             console.error('Delete алдаа:', err);
//             alert('Зураг устгах үед алдаа гарлаа');
//         }
//     };

//     const handleUpload = async () => {
//         if (!selectedFile) return;
//         setLoading(true);

//         const formData = new FormData();
//         formData.append('images', selectedFile);
//         formData.append('newsid', newsId?.toString() || '');

//         // formData.append('newsid', newsId!=null??newsId?.toString());

//         try {
//             const res = await fetch('https://shdmonitoring.ub.gov.mn/api/image/upload', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err.message || 'Upload амжилтгүй');
//             }

//             const result = await res.json();
//             alert('Зураг амжилттай илгээгдлээ');
//             setSelectedFile(null);
//             setPreview(null);
//             await fetchImages(); // Шинэ зурагнуудыг дахин татах
//         } catch (err) {
//             console.error('Upload алдаа:', err);
//             alert('Зураг илгээх үед алдаа гарлаа');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
//             <DialogContent className="max-w-sm">
//                 <DialogHeader>
//                     <div className="max-h-[200px] overflow-x-auto overflow-y-hidden">
//                         <div className="flex gap-2">
//                             {images.length > 0 ? (
//                                 images.map((img) => (
//                                     <div
//                                         key={img.imageid}
//                                         className="relative w-[120px] h-[80px] flex-shrink-0 border rounded-md shadow overflow-hidden"
//                                     >
//                                         <img
//                                             src={`https://shdmonitoring.ub.gov.mn/${img.imagepath}`}
//                                             alt="uploaded"
//                                             className="w-full h-full object-cover"
//                                         />
//                                         <button
//                                             onClick={() => handleDelete(img.imageid)}
//                                             className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded hover:bg-red-600"
//                                         >
//                                             Устгах
//                                         </button>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-sm text-gray-400">Зураг олдсонгүй</p>
//                             )}
//                         </div>
//                     </div>
//                 </DialogHeader>
//                 <DialogTitle>Зураг оруулах</DialogTitle>

//                 <Input type="file" accept="image/*" onChange={handleFileChange} />

//                 {preview && (
//                     <div className="mt-4">
//                         <img
//                             src={preview}
//                             alt="preview"
//                             width={300}
//                             height={200}
//                             className="rounded-md object-cover border"
//                         />
//                     </div>
//                 )}

//                 <DialogFooter className="mt-4">
//                     <Button onClick={handleUpload} disabled={!selectedFile || loading}>
//                         {loading ? 'Түр хүлээнэ үү...' : 'Илгээх'}
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }

'use client';

import { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';


interface Props {
    open: boolean;
    onClose: () => void;
    newsId: number | null;
}

interface Image {
    id: number;
    imagepath: string;
    imageid: number;
}

export default function ImageUploadModal({ open, onClose, newsId }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<Image[]>([]);

    // ✅ Modal open үед зураг татна
    useEffect(() => {
        const fetchImages = async () => {
            if (!open || newsId === null) return;

            try {
                const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/image/${newsId}`);
                const data = await res.json();
                setImages(data.images);
            } catch (err) {
                console.error('Алдаа:', err);
            }
        };

        fetchImages();
    }, [open, newsId]);

    if (!open || newsId === null) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;

        const compressed = await compressImage(file);
        setSelectedFile(compressed);
        setPreview(URL.createObjectURL(compressed));
    };

    const compressImage = (file: File, maxWidth = 600, quality = 0.5): Promise<File> => {
        return new Promise((resolve, reject) => {
            const image = document.createElement('img');
            const reader = new FileReader();

            reader.onload = (e) => {
                image.src = e.target?.result as string;
            };

            image.onload = () => {
                const canvas = document.createElement('canvas');
                const scaleFactor = maxWidth / image.width;
                canvas.width = maxWidth;
                canvas.height = image.height * scaleFactor;

                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Canvas not supported');

                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (!blob) return reject('Compression failed');
                    resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                }, 'image/jpeg', quality);
            };

            reader.readAsDataURL(file);
        });
    };

    const handleDelete = async (imageId: number, filename: string) => {
        if (!confirm('Энэ зургийг устгах уу?')) return;
        const fileName = filename ? filename.split('/').pop() || '' : '';

        try {
            const res = await fetch(`https://shdmonitoring.ub.gov.mn/api/image/delete/${imageId}/${fileName}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Устгах амжилтгүй');

            setImages((prev) => prev.filter((img) => img.imageid !== imageId));
        } catch (err) {
            console.error('Delete алдаа:', err);
            alert('Зураг устгах үед алдаа гарлаа');
        }
    };



    const handleUpload = async () => {
        if (!selectedFile || newsId === null) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('images', selectedFile);
        formData.append('newsid', newsId.toString());

        try {
            const res = await fetch('https://shdmonitoring.ub.gov.mn/api/image/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload амжилтгүй');

            alert('Зураг амжилттай илгээгдлээ');
            setSelectedFile(null);
            setPreview(null);
            onClose(); // modal хаах
        } catch (err) {
            console.error('Upload алдаа:', err);
            alert('Зураг илгээх үед алдаа гарлаа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-lg font-bold mb-4">Зураг оруулах</h2>

                {/* Одоогийн зургууд */}
                <div className="flex overflow-x-auto gap-2 mb-4 max-h-[100px]">
                    {images.length > 0 ? (
                        images.map((img) => (
                            <div key={img.imageid} className="relative w-[120px] h-[80px] border rounded overflow-hidden">
                                <img
                                    src={`https://shdmonitoring.ub.gov.mn/${img.imagepath}`}
                                    alt="uploaded"
                                    className="w-full h-full object-cover"
                                />
                                {/* <button
                  onClick={() => handleDelete(img.imageid)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded"
                >
                  Устгах
                </button> */}
                                <button
                                    onClick={() => handleDelete(img.imageid, img.imagepath)}
                                    title="Устгах"
                                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-sm"
                                >
                                    <Trash size={14} />
                                </button>

                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">Зураг байхгүй</p>
                    )}
                </div>

                {/* Файл сонгох */}
                <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

                {/* Preview */}
                {preview && (
                    <div className="mb-4">
                        <img
                            src={preview}
                            alt="preview"
                            className="w-full h-auto max-h-[200px] object-cover border rounded"
                        />
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Илгээж байна...' : 'Зураг илгээх'}
                </button>
            </div>
        </div>
    );
}

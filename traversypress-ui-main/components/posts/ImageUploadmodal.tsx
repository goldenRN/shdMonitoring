'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface Props {
    open: boolean;
    onClose: () => void;
    newsId: number; // news ID-г props-р авч байна
}

export default function ImageUploadModal({ open, onClose, newsId }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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

    const handleUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('images', selectedFile);
        formData.append('newsid', newsId.toString());
        console.log("formData==", formData)
        try {
            const res = await fetch('https://shdmonitoring.ub.gov.mn/api/image/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Upload амжилтгүй');
            }

            const result = await res.json();
            console.log('Амжилттай:', result);
            alert('Зураг амжилттай илгээгдлээ');
            onClose();
            setSelectedFile(null);
            setPreview(null);
        } catch (err) {
            console.error('Upload алдаа:', err);
            alert('Зураг илгээх үед алдаа гарлаа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Зураг оруулах</DialogTitle>
                </DialogHeader>

                <Input type="file" accept="image/*" onChange={handleFileChange} />

                {preview && (
                    <div className="mt-4">
                        <Image
                            src={preview}
                            alt="preview"
                            width={300}
                            height={200}
                            className="rounded-md object-cover border"
                        />
                    </div>
                )}

                <DialogFooter className="mt-4">
                    <Button onClick={handleUpload} disabled={!selectedFile || loading}>
                        {loading ? 'Түр хүлээнэ үү...' : 'Илгээх'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

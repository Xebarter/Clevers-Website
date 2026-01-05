import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UploadResult {
  url?: string
  path?: string
  error?: string
}

interface GalleryImage {
  _id: string;
  title: string;
  file_url: string;
  file_name: string;
  category?: string;
}

interface GalleryFormProps {
  initialData?: GalleryImage;
  onSubmit: (data: Omit<GalleryImage, '_id'>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function GalleryForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}: GalleryFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [fileUrls, setFileUrls] = useState<string[]>(initialData?.file_url ? [initialData.file_url] : []);
  const [fileNames, setFileNames] = useState<string[]>(initialData?.file_name ? [initialData.file_name] : []);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.file_url ? [initialData.file_url] : []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 提交所有图片
    fileUrls.forEach((url, index) => {
      onSubmit({
        title,
        file_url: url,
        file_name: fileNames[index],
        category
      });
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      formData.append('bucket', 'gallery-images');
      formData.append('folder', 'images');

      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const json = await resp.json();

      if (!resp.ok) {
        const errMsg = json?.error || `HTTP ${resp.status}`;
        console.error('Upload error:', errMsg);
        alert(`Upload failed: ${errMsg}`);
        return;
      }

      const results: UploadResult[] = Array.isArray(json.results) ? json.results : [];

      results.forEach((result, idx) => {
        const file = files[idx];
        if (!result) {
          console.error(`Upload failed for ${file.name}: No result returned`);
          return;
        }
        if (result.error) {
          console.error('Upload error:', result.error);
          alert(`Upload failed for ${file.name}: ${result.error}`);
          return;
        }
        if (result.url) {
          setFileUrls(prev => [...prev, result.url as string]);
          setFileNames(prev => [...prev, file.name]);
          setImagePreviews(prev => [...prev, result.url as string]);
        } else {
          console.error(`Upload error for ${file.name}: No URL returned`);
          alert(`Upload failed for ${file.name}: No URL returned`);
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFileUrls(prev => prev.filter((_, i) => i !== index));
    setFileNames(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="max-w-3xl mx-auto border-0 shadow-lg rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl p-6">
        <CardTitle className="text-2xl font-bold">
          {initialData ? 'Edit Gallery Image' : 'Add Gallery Image'}
        </CardTitle>
        <p className="text-blue-100">
          {initialData
            ? 'Update the gallery image details'
            : 'Add a new gallery image to showcase on the website'}
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter image title"
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-700">Campus Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select a campus or enter custom category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kitintale">Kitintale</SelectItem>
                <SelectItem value="Kasokoso">Kasokoso</SelectItem>
                <SelectItem value="Maganjo">Maganjo</SelectItem>
                <SelectItem value="other">Other/General</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Or enter a custom category"
              className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images" className="text-gray-700">Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              ref={fileInputRef}
              disabled={uploading}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {uploading && <p className="text-sm text-blue-500">Uploading images...</p>}
          </div>

          {imagePreviews.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-700">Previews</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50">
                    <img
                      src={preview}
                      alt={`${title} ${index + 1}`}
                      className="w-full h-32 object-contain rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploading || !title || fileUrls.length === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Images' : 'Add Images'}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
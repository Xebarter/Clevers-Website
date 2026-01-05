export default function MultiImageGalleryForm({
  onSubmit,
  onCancel,
  isLoading
}: MultiImageGalleryFormProps) {
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<Array<{
    file: File;
    preview: string;
    title: string;
    uploading: boolean;
    progress?: number;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension from filename for title
      uploading: false,
      progress: 0
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleTitleChange = (index: number, title: string) => {
    setImages(prev => {
      const updated = [...prev];
      updated[index].title = title;
      return updated;
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      // Revoke the preview URL to free up memory
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadAllImages = async () => {
    if (images.length === 0) return;

    // Batch upload all selected images in one request and show progress
    const results: Omit<GalleryImage, '_id'>[] = [];

    setImages(prev => prev.map(img => ({ ...img, uploading: true })));

    try {
      const formData = new FormData();
      images.forEach(img => formData.append('files', img.file));
      formData.append('bucket', 'gallery-images');
      formData.append('folder', 'images');

      const sizes = images.map(i => i.file.size || 0);
      const cumSizes: number[] = [];
      sizes.reduce((acc, s, idx) => { const next = acc + s; cumSizes[idx] = next; return next; }, 0);

      await new Promise<void>((resolve, reject) => {
        const xhr: any = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');

        xhr.upload.onprogress = (e: ProgressEvent) => {
          const loaded = e.loaded;
          setImages(prev => prev.map((img, idx) => {
            const prevCum = (cumSizes[idx] || 0) - (sizes[idx] || 0);
            const fileLoaded = Math.max(0, Math.min(sizes[idx] || 0, loaded - prevCum));
            const progress = sizes[idx] ? Math.floor((fileLoaded / sizes[idx]) * 100) : 100;
            return { ...img, uploading: loaded > prevCum, progress };
          }));
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error(`HTTP ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });

      // mark finished
      setImages(prev => prev.map(img => ({ ...img, uploading: false, progress: 100 })));

      // Fetch final JSON results
      const resp = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await resp.json();
      if (!resp.ok) {
        const errMsg = json?.error || `HTTP ${resp.status}`;
        console.error('Upload error:', errMsg);
        alert(`Upload failed: ${errMsg}`);
        return;
      }

      const fileResults: any[] = Array.isArray(json.results) ? json.results : [];
      fileResults.forEach((fileResult, idx) => {
        const image = images[idx];
        if (!fileResult) return;
        if (fileResult.error) {
          console.error('Upload error:', fileResult.error);
          alert(`Upload failed for ${image.file.name}: ${fileResult.error}`);
          return;
        }
        if (fileResult.url) {
          results.push({
            title: image.title,
            file_url: fileResult.url,
            file_name: image.file.name,
            alt_text: undefined,
            caption: undefined,
            category: category
          });
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setImages(prev => prev.map(img => ({ ...img, uploading: false })));
    }

    if (results.length > 0) onSubmit(results);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadAllImages();
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="max-w-4xl mx-auto border-0 shadow-lg rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl p-6">
        <CardTitle className="text-2xl font-bold">
          Add Multiple Gallery Images
        </CardTitle>
        <p className="text-blue-100">
          Upload multiple images at once. Each image will be added as a separate gallery item.
          Note: This form is for creating new gallery images only, not for editing existing ones.
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 p-6">
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
            <Label className="text-gray-700">Select Images</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={triggerFileInput}
            >
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  ></path>
                </svg>
                <p className="text-gray-600">
                  Click to select images or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports multiple image selection
                </p>
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Selected Images ({images.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden bg-gray-50 flex flex-col"
                  >
                    <div className="relative">
                      {image.uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        </div>
                      )}
                      <img
                        src={image.preview}
                        alt={image.title}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="p-2 flex-1">
                      <Input
                        value={image.title}
                        onChange={(e) => handleTitleChange(index, e.target.value)}
                        placeholder="Enter title"
                        className="text-sm mb-2"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(index)}
                        disabled={image.uploading}
                        className="w-full"
                      >
                        Remove
                      </Button>
                    </div>
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
              disabled={isLoading || images.length === 0 || images.some(img => img.uploading)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {isLoading ? 'Saving...' : `Upload ${images.length} Image${images.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
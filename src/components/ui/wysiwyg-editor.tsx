"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import {
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3, X, Check
} from 'lucide-react';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface WysiwygEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function WysiwygEditor({
  initialContent = '',
  onChange,
  placeholder = 'Start writing...',
  className,
  minHeight = '200px'
}: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('https://');
  const [imageAlt, setImageAlt] = useState('');

  // Initialize content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  // Save content changes and notify parent
  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  // Format commands
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleContentChange();
    editorRef.current?.focus();
  };

  // Text alignment
  const handleAlign = (alignment: 'left' | 'center' | 'right') => {
    executeCommand('justify' + alignment);
  };

  // Heading styles
  const handleHeading = (level: 1 | 2 | 3) => {
    executeCommand('formatBlock', `<h${level}>`);
  };

  // Handle link insertion
  const handleInsertLink = () => {
    if (linkUrl && linkUrl !== 'https://') {
      const text = linkText || linkUrl;
      const html = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      executeCommand('insertHTML', html);
      setIsLinkPopoverOpen(false);
      setLinkUrl('https://');
      setLinkText('');
    }
  };

  // Handle image insertion
  const handleInsertImage = () => {
    if (imageUrl && imageUrl !== 'https://') {
      const alt = imageAlt || 'Image';
      const html = `<img src="${imageUrl}" alt="${alt}" style="max-width: 100%;" />`;
      executeCommand('insertHTML', html);
      setIsImagePopoverOpen(false);
      setImageUrl('https://');
      setImageAlt('');
    }
  };

  return (
    <div className={cn("border rounded-md", className)}>
      {/* Toolbar */}
      <div className="border-b p-2 bg-gray-50 flex flex-wrap items-center gap-1">
        <div className="flex items-center gap-1 mr-2">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => executeCommand('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => executeCommand('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => executeCommand('underline')}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 mr-2">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 mr-2">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handleAlign('left')}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handleAlign('center')}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handleAlign('right')}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 mr-2">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handleHeading(1)}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handleHeading(2)}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handleHeading(3)}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                title="Insert Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Insert Link</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the URL and text for your link.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="linkUrl" className="text-right">
                      URL
                    </Label>
                    <Input
                      id="linkUrl"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="linkText" className="text-right">
                      Text
                    </Label>
                    <Input
                      id="linkText"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      className="col-span-3"
                      placeholder="Leave empty to use URL"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsLinkPopoverOpen(false)}
                    type="button"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleInsertLink}>
                    <Check className="mr-2 h-4 w-4" />
                    Insert
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Insert Image</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the URL and alt text for your image.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageUrl" className="text-right">
                      URL
                    </Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageAlt" className="text-right">
                      Alt Text
                    </Label>
                    <Input
                      id="imageAlt"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      className="col-span-3"
                      placeholder="Describe the image"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsImagePopoverOpen(false)}
                    type="button"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleInsertImage}>
                    <Check className="mr-2 h-4 w-4" />
                    Insert
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Editable content area */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 focus:outline-none overflow-y-auto"
        style={{ minHeight }}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        data-placeholder={placeholder}
        onFocus={(e) => {
          if (e.currentTarget.innerHTML === '') {
            e.currentTarget.innerHTML = '';
          }
        }}
      />
    </div>
  );
}

export default WysiwygEditor;

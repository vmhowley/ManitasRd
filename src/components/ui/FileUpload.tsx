import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, File, Image, FileText, AlertCircle } from 'lucide-react';
import { Button } from './Button';

// Types
type FileUploadVariant = 'default' | 'compact' | 'dropzone';
type FileUploadSize = 'sm' | 'md' | 'lg';
type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error';
type FileType = 'image' | 'document' | 'other';

interface FileWithPreview extends File {
  preview?: string;
  type: string;
  fileType?: FileType;
  uploadProgress?: number;
  error?: string;
  id: string;
}

interface FileUploadProps {
  value?: FileWithPreview[];
  defaultValue?: FileWithPreview[];
  onChange?: (files: FileWithPreview[]) => void;
  onUpload?: (files: FileWithPreview[]) => Promise<void>;
  onRemove?: (file: FileWithPreview) => void;
  onRemoveAll?: () => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  minSize?: number; // in bytes
  disabled?: boolean;
  variant?: FileUploadVariant;
  size?: FileUploadSize;
  label?: string;
  helperText?: string;
  error?: string;
  showPreview?: boolean;
  previewMaxHeight?: number;
  showFileSize?: boolean;
  showFileType?: boolean;
  showRemoveButton?: boolean;
  showRemoveAllButton?: boolean;
  dragActiveClassName?: string;
  className?: string;
  buttonText?: string;
  dragText?: string;
  id?: string;
}

export function FileUpload({
  value,
  defaultValue = [],
  onChange,
  onUpload,
  onRemove,
  onRemoveAll,
  accept,
  multiple = false,
  maxFiles = 5,
  maxSize,
  minSize,
  disabled = false,
  variant = 'default',
  size = 'md',
  label,
  helperText,
  error,
  showPreview = true,
  previewMaxHeight = 200,
  showFileSize = true,
  showFileType = true,
  showRemoveButton = true,
  showRemoveAllButton = true,
  dragActiveClassName = '',
  className = '',
  buttonText = 'Choose File',
  dragText = 'Drag and drop files here, or click to select files',
  id,
}: FileUploadProps) {
  // Generate a unique ID if not provided
  const uploadId = id || `file-upload-${Math.random().toString(36).substring(2, 9)}`;
  
  // State for controlled/uncontrolled usage
  const [files, setFiles] = useState<FileWithPreview[]>(defaultValue);
  const isControlled = value !== undefined;
  const currentFiles = isControlled ? value : files;
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [, setUploadStatus] = useState<FileUploadStatus>('idle');
  
  // Size classes
  const sizeClasses = {
    sm: {
      button: 'text-xs py-1 px-2',
      dropzone: 'p-4',
      text: 'text-xs',
      icon: '16',
    },
    md: {
      button: 'text-sm py-2 px-3',
      dropzone: 'p-6',
      text: 'text-sm',
      icon: '20',
    },
    lg: {
      button: 'text-base py-2.5 px-4',
      dropzone: 'p-8',
      text: 'text-base',
      icon: '24',
    },
  };
  
  // Handle file selection
  const handleFileChange = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;
      
      // Convert FileList to array
      const fileArray = Array.from(selectedFiles);
      
      // Apply file limits
      let newFiles = fileArray
        .slice(0, multiple ? maxFiles - (currentFiles?.length || 0) : 1)
        .map(file => {
          // Determine file type
          let fileType: FileType = 'other';
          if (file.type.startsWith('image/')) {
            fileType = 'image';
          } else if (
            file.type.includes('pdf') ||
            file.type.includes('document') ||
            file.type.includes('sheet') ||
            file.type.includes('presentation')
          ) {
            fileType = 'document';
          }
          
          // Create file with preview and ID
          const fileWithPreview: FileWithPreview = Object.assign(file, {
            preview: fileType === 'image' ? URL.createObjectURL(file) : undefined,
            fileType,
            uploadProgress: 0,
            id: Math.random().toString(36).substring(2, 9),
          });
          
          return fileWithPreview;
        });
      
      // Validate file size if specified
      if (maxSize || minSize) {
        newFiles = newFiles.filter(file => {
          const tooLarge = maxSize && file.size > maxSize;
          const tooSmall = minSize && file.size < minSize;
          
          if (tooLarge) {
            file.error = `File is too large. Maximum size is ${formatFileSize(maxSize)}.`;
          } else if (tooSmall) {
            file.error = `File is too small. Minimum size is ${formatFileSize(minSize)}.`;
          }
          
          return !tooLarge && !tooSmall;
        });
      }
      
      // Update files state
      const updatedFiles = multiple ? [...(currentFiles || []), ...newFiles] : newFiles;
      
      if (!isControlled) {
        setFiles(updatedFiles);
      }
      
      onChange?.(updatedFiles);
      
      // Auto-upload if onUpload is provided
      if (onUpload && newFiles.length > 0) {
        handleUpload(updatedFiles);
      }
    },
    [currentFiles, isControlled, maxFiles, maxSize, minSize, multiple, onChange, onUpload]
  );
  
  // Handle file upload
  const handleUpload = async (filesToUpload: FileWithPreview[]) => {
    if (!onUpload || filesToUpload.length === 0) return;
    
    try {
      setUploadStatus('uploading');
      await onUpload(filesToUpload);
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload failed:', error);
    }
  };
  
  // Handle file removal
  const handleRemove = (fileToRemove: FileWithPreview) => {
    // Revoke object URL to avoid memory leaks
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const updatedFiles = (currentFiles || []).filter(file => file.id !== fileToRemove.id);
    
    if (!isControlled) {
      setFiles(updatedFiles);
    }
    
    onChange?.(updatedFiles);
    onRemove?.(fileToRemove);
  };
  
  // Handle remove all files
  const handleRemoveAll = () => {
    // Revoke all object URLs
    (currentFiles || []).forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    if (!isControlled) {
      setFiles([]);
    }
    
    onChange?.([]);
    onRemoveAll?.();
  };
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };
  
  // Handle button click
  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get file icon based on type
  const getFileIcon = (file: FileWithPreview) => {
    if (file.fileType === 'image') {
      return <Image size={parseInt(sizeClasses[size].icon)} />;
    } else if (file.fileType === 'document') {
      return <FileText size={parseInt(sizeClasses[size].icon)} />;
    } else {
      return <File size={parseInt(sizeClasses[size].icon)} />;
    }
  };
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      (currentFiles || []).forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);
  
  // Render file list
  const renderFileList = () => {
    if (!currentFiles || currentFiles.length === 0) return null;
    
    return (
      <ul className="mt-3 space-y-2">
        {currentFiles.map((file) => (
          <li
            key={file.id}
            className={`
              flex items-center justify-between
              p-2 rounded-md border
              ${file.error ? 'border-error-300 bg-error-50' : 'border-neutral-200 bg-neutral-50'}
            `}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              {/* File icon or preview */}
              {showPreview && file.fileType === 'image' && file.preview ? (
                <div
                  className="flex-shrink-0 rounded-md overflow-hidden bg-neutral-100"
                  style={{ maxHeight: `${previewMaxHeight}px`, maxWidth: `${previewMaxHeight}px` }}
                >
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 text-neutral-500">
                  {getFileIcon(file)}
                </div>
              )}
              
              {/* File info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col">
                  <span className={`truncate font-medium ${sizeClasses[size].text}`}>
                    {file.name}
                  </span>
                  <div className={`flex ${sizeClasses[size].text} text-neutral-500`}>
                    {showFileSize && (
                      <span className="truncate">{formatFileSize(file.size)}</span>
                    )}
                    {showFileType && showFileSize && <span className="mx-1">•</span>}
                    {showFileType && (
                      <span className="truncate capitalize">{file.fileType}</span>
                    )}
                  </div>
                  
                  {/* Error message */}
                  {file.error && (
                    <div className="flex items-center mt-1 text-error-500 text-xs">
                      <AlertCircle size={12} className="mr-1" />
                      {file.error}
                    </div>
                  )}
                  
                  {/* Upload progress */}
                  {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                    <div className="w-full mt-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${file.uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Remove button */}
            {showRemoveButton && !disabled && (
              <button
                type="button"
                onClick={() => handleRemove(file)}
                className="ml-2 flex-shrink-0 text-neutral-400 hover:text-neutral-500 focus:outline-none"
                aria-label={`Remove ${file.name}`}
              >
                <X size={parseInt(sizeClasses[size].icon) - 4} />
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };
  
  // Render by variant
  const renderUploadControl = () => {
    switch (variant) {
      case 'dropzone':
        return (
          <div
            className={`
              border-2 border-dashed rounded-lg
              ${dragActive ? 'border-primary-500 bg-primary-50 ' + dragActiveClassName : 'border-neutral-300'}
              ${disabled ? 'opacity-60 cursor-not-allowed bg-neutral-50' : 'cursor-pointer hover:bg-neutral-50'}
              ${error ? 'border-error-300' : ''}
              ${sizeClasses[size].dropzone}
              transition-colors duration-200
              flex flex-col items-center justify-center text-center
            `}
            onClick={handleButtonClick}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <Upload
              size={parseInt(sizeClasses[size].icon) + 8}
              className={`mb-2 ${error ? 'text-error-500' : 'text-neutral-400'}`}
            />
            <p className={`${sizeClasses[size].text} font-medium ${error ? 'text-error-500' : 'text-neutral-700'}`}>
              {dragText}
            </p>
            <p className={`mt-1 ${sizeClasses[size].text} ${error ? 'text-error-400' : 'text-neutral-500'}`}>
              {accept ? `Accepts: ${accept.replace(/,/g, ', ')}` : ''}
              {maxSize ? ` • Max size: ${formatFileSize(maxSize)}` : ''}
            </p>
          </div>
        );
        
      case 'compact':
        return (
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              onClick={handleButtonClick}
              disabled={disabled}
              size={size === 'lg' ? 'md' : size}
              variant="outline"
              className={error ? 'border-error-300 text-error-500' : ''}
            >
              <Upload size={parseInt(sizeClasses[size].icon) - 4} className="mr-2" />
              {buttonText}
            </Button>
            {currentFiles && currentFiles.length > 0 && (
              <span className={`${sizeClasses[size].text} text-neutral-500`}>
                {currentFiles.length} file{currentFiles.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        );
        
      default: // 'default'
        return (
          <Button
            type="button"
            onClick={handleButtonClick}
            disabled={disabled}
            size={size}
            variant="outline"
            className={`w-full justify-center ${error ? 'border-error-300 text-error-500' : ''}`}
          >
            <Upload size={parseInt(sizeClasses[size].icon)} className="mr-2" />
            {buttonText}
          </Button>
        );
    }
  };
  
  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label
          htmlFor={uploadId}
          className={`block mb-2 ${sizeClasses[size].text} font-medium ${error ? 'text-error-500' : 'text-neutral-700'}`}
        >
          {label}
        </label>
      )}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id={uploadId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => handleFileChange(e.target.files)}
      />
      
      {/* Upload control */}
      {renderUploadControl()}
      
      {/* File list */}
      {renderFileList()}
      
      {/* Remove all button */}
      {showRemoveAllButton && currentFiles && currentFiles.length > 1 && !disabled && (
        <Button
          type="button"
          onClick={handleRemoveAll}
          size="sm"
          variant="ghost"
          className="mt-2 text-neutral-500 hover:text-neutral-700"
        >
          <X size={parseInt(sizeClasses[size].icon) - 4} className="mr-1" />
          Remove all files
        </Button>
      )}
      
      {/* Helper text or error */}
      {(helperText || error) && (
        <div className={`mt-2 ${sizeClasses[size].text} ${error ? 'text-error-500' : 'text-neutral-500'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useRef } from 'react';
import { BookMarked, Download, Upload } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from './ui/sidebar';

interface HeaderProps {
  importBookmarks: (file: File) => void;
  exportBookmarks: () => void;
}

export default function Header({ importBookmarks, exportBookmarks }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importBookmarks(file);
      // Reset file input value to allow re-importing the same file
      event.target.value = '';
    }
  };
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <BookMarked className="h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground">
          VerseMark
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Download className="h-5 w-5" />
              <span className="sr-only">Import/Export Bookmarks</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={handleImportClick}>
              <Upload className="mr-2 h-4 w-4" />
              <span>Import Bookmarks</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={exportBookmarks}>
              <Download className="mr-2 h-4 w-4" />
              <span>Export Bookmarks</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />
        <ThemeToggle />
        <SidebarTrigger className="flex" />
      </div>
    </header>
  );
}

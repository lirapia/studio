'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

export function MonetagScripts() {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = '//pl24231845.highcpmgate.com/21f4229548d1921316b2505658518b03/invoke.js';
    script1.async = true;
    script1.dataset.cfasync = 'false';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `(function(s){s.dataset.zone='9956044',s.src='https://forfrogadiertor.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.head.appendChild(script2);

    const script4 = document.createElement('script');
    script4.src = '//yohle.com/ntfc.php?p=10036763';
    script4.async = true;
    script4.dataset.cfasync = 'false';
    script4.onerror = () => {
        if (window._duhny) {
            window._duhny();
        }
    }
    script4.onload = () => {
        if (window._wwxvo) {
            window._wwxvo();
        }
    }
    document.head.appendChild(script4);

    return () => {
        document.head.removeChild(script1);
        document.head.removeChild(script2);
        document.head.removeChild(script4);
    }
  }, []);

  return null;
}

declare global {
    interface Window {
        _duhny?: () => void;
        _wwxvo?: () => void;
    }
}

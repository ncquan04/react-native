// usePrevious.tsx
import { useEffect, useRef } from 'react';

function usePrevious(value: any): any {
    const ref = useRef<any>(null);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current || value;
}

export default usePrevious;
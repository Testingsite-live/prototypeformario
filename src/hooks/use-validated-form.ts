import { useCallback, useRef, useState } from "react";

export type Errors<T> = Partial<Record<keyof T, string>>;

/** Small form state helper: validates on blur and on submit, re-validates touched fields on change. */
export function useValidatedForm<T extends Record<string, string | boolean>>(initial: T, validate: (v: T) => Errors<T>) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Errors<T>>({});
  const touched = useRef<Set<keyof T>>(new Set());

  const set = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value };
        if (touched.current.has(name)) {
          const e = validate(next);
          setErrors((old) => ({ ...old, [name]: e[name] ?? "" }));
        }
        return next;
      });
    },
    [validate],
  );

  const blur = useCallback(
    (name: keyof T) => {
      touched.current.add(name);
      setValues((prev) => {
        const e = validate(prev);
        setErrors((old) => ({ ...old, [name]: e[name] ?? "" }));
        return prev;
      });
    },
    [validate],
  );

  const validateAll = useCallback(() => {
    const e = validate(values);
    Object.keys(values).forEach((k) => touched.current.add(k as keyof T));
    setErrors(e);
    return Object.entries(e).filter(([, msg]) => Boolean(msg)) as [keyof T, string][];
  }, [validate, values]);

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
    touched.current.clear();
  }, [initial]);

  return { values, errors, set, blur, validateAll, reset, setValues };
}

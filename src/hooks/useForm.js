import { useState } from 'react';

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name] && validate) {
      const errs = validate(next);
      setErrors((prev) => ({ ...prev, [name]: errs[name] || '' }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validate) {
      const errs = validate(values);
      setErrors((prev) => ({ ...prev, [name]: errs[name] || '' }));
    }
  }

  function handleSubmit(onSubmit) {
    return (e) => {
      e.preventDefault();
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);
      if (validate) {
        const errs = validate(values);
        setErrors(errs);
        if (Object.values(errs).some(Boolean)) return;
      }
      onSubmit(values);
    };
  }

  function reset() {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset, setValues };
}

export default useForm;

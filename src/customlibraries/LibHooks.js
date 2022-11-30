import { useState as S } from "react";
export function FormDataFieldsFunc(event) {
  const [formData, setFormData] = S(event);
  return [
    formData, function (e) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    },
  ];
}
import { useState } from "react";
import type { IHomeFormData } from "./interface";
import { useAppStore } from "@/store/useAppStore";

export const useHomeController = () => {
    const { theme, toggleTheme } = useAppStore();
    
    const [formData, setFormData] = useState<IHomeFormData>({
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name) {
            alert("Please enter a name.");
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            alert(`Hello ${formData.name}!`);
            setLoading(false);
        }, 1000);
    };

    return {
        formData,
        loading,
        theme,
        handleInputChange,
        handleSubmit,
        toggleTheme,
    };
};

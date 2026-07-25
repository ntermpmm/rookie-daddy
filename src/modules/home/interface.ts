export interface IHomeFormData {
    name: string;
    description: string;
}

export interface IHomeContentProps {
    formData: IHomeFormData;
    loading: boolean;
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    onSubmit: (e: React.FormEvent) => void;
}

"use client";

import { useHomeController } from "./controller";
import { HomeContent } from "./view/home-content";

export const HomeContainer = () => {
    const {
        formData,
        loading,
        theme,
        handleInputChange,
        handleSubmit,
        toggleTheme,
    } = useHomeController();

    return (
        <div className={`min-h-screen p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Rookie Dad</h1>
                    <button 
                        onClick={toggleTheme}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        Toggle Theme ({theme})
                    </button>
                </div>
                
                <HomeContent
                    formData={formData}
                    loading={loading}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

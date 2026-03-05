import { createContext, useContext, useState, useEffect } from 'react';
import { preferencesAPI } from '../api';

const PreferenceContext = createContext();

export const PreferenceProvider = ({ children }) => {
  const [preferredSource, setPreferredSource] = useState('eastmoney');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      const res = await preferencesAPI.get();
      setPreferredSource(res.data.preferred_source || 'eastmoney');
    } catch (error) {
      console.error('加载数据源偏好失败', error);
      // 失败时使用默认值
      setPreferredSource('eastmoney');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (newSource) => {
    try {
      await preferencesAPI.update(newSource);
      setPreferredSource(newSource);
    } catch (error) {
      console.error('更新数据源偏好失败', error);
      throw error;
    }
  };

  return (
    <PreferenceContext.Provider value={{ preferredSource, updatePreference, loading }}>
      {children}
    </PreferenceContext.Provider>
  );
};

export const usePreference = () => {
  const context = useContext(PreferenceContext);
  if (!context) {
    throw new Error('usePreference must be used within PreferenceProvider');
  }
  return context;
};

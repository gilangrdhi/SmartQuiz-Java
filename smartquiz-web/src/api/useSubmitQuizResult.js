import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';

export const useSubmitQuizResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await axios.post('http://localhost:8080/api/quizzes/submit-result', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      message.success('Hasil kuis berhasil disimpan! Poin kamu bertambah.');
    },
    onError: (error) => {
      message.error(`Gagal menyimpan hasil: ${error.response?.data || error.message}`);
    }
  });
};
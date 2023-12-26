import { useFileTreeStore } from '@/store/useFileTreeStore';
import axiosInstance from '@/app/api/axiosInstance';
import { transformToFileNodeType } from '../../../utils/filetree/transNodeutils';

export const checkFileTree = async (projectId: string) => {
  try {
    const { setFileTree } = useFileTreeStore.getState();

    const response = await axiosInstance.get(
      `/api/projects/${projectId}/directory`
    );
    const transformedData = transformToFileNodeType(response.data.results);

    setFileTree(transformedData); // Zustand 스토어에 저장
    console.log('바뀐 데이터 타입', transformedData);

    return response;
  } catch (error) {
    console.error(error);
  }
};